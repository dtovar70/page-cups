import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useShallow } from 'zustand/react/shallow'

import type { CartItem } from '@/@types/cart'
import type { Product } from '@/@types/product'

interface CartState {
    items: CartItem[]
    addItem: (product: Product, variantId: string, quantity?: number) => void
    removeItem: (lineId: string) => void
    updateQuantity: (lineId: string, quantity: number) => void
    clear: () => void
}

export interface CartActions {
    addItem: CartState['addItem']
    removeItem: CartState['removeItem']
    updateQuantity: CartState['updateQuantity']
    clear: CartState['clear']
}

export const MAX_LINE_QUANTITY = 99

function buildLineId(productId: string, variantId: string): string {
    return `${productId}:${variantId}`
}

function clampQuantity(quantity: number, stock: number): number {
    const ceiling = Math.min(stock, MAX_LINE_QUANTITY)
    return Math.max(1, Math.min(Math.trunc(quantity), ceiling))
}

function createLine(product: Product, variantId: string, quantity: number): CartItem | null {
    const variant = product.variants.find((candidate) => candidate.id === variantId)
    if (!variant) return null

    return {
        lineId: buildLineId(product.id, variant.id),
        productId: product.id,
        slug: product.slug,
        name: product.name,
        category: product.category,
        variantId: variant.id,
        variantLabel: variant.label,
        colorHex: product.colorHex,
        printText: product.printText,
        unitPrice: product.price + variant.priceDelta,
        quantity: clampQuantity(quantity, product.stock),
    }
}

export const useCartStore = create<CartState>()(
    persist(
        (set) => ({
            items: [],

            addItem: (product, variantId, quantity = 1) =>
                set((state) => {
                    const line = createLine(product, variantId, quantity)
                    if (!line) return state

                    const existing = state.items.find((item) => item.lineId === line.lineId)
                    if (!existing) {
                        return { items: [...state.items, line] }
                    }

                    return {
                        items: state.items.map((item) =>
                            item.lineId === line.lineId
                                ? {
                                      ...item,
                                      quantity: clampQuantity(
                                          item.quantity + line.quantity,
                                          product.stock,
                                      ),
                                  }
                                : item,
                        ),
                    }
                }),

            removeItem: (lineId) =>
                set((state) => ({
                    items: state.items.filter((item) => item.lineId !== lineId),
                })),

            updateQuantity: (lineId, quantity) =>
                set((state) => {
                    if (quantity < 1) {
                        return { items: state.items.filter((item) => item.lineId !== lineId) }
                    }

                    return {
                        items: state.items.map((item) =>
                            item.lineId === lineId
                                ? {
                                      ...item,
                                      quantity: clampQuantity(quantity, MAX_LINE_QUANTITY),
                                  }
                                : item,
                        ),
                    }
                }),

            clear: () => set({ items: [] }),
        }),
        {
            name: 'manada-russo-cart',
            version: 1,
            partialize: (state) => ({ items: state.items }),
        },
    ),
)

export function useCartItems(): CartItem[] {
    return useCartStore((state) => state.items)
}

export function useCartCount(): number {
    return useCartStore((state) => state.items.reduce((count, item) => count + item.quantity, 0))
}

export function useCartSubtotal(): number {
    return useCartStore((state) =>
        state.items.reduce((total, item) => total + item.unitPrice * item.quantity, 0),
    )
}

export function useCartActions(): CartActions {
    return useCartStore(
        useShallow((state) => ({
            addItem: state.addItem,
            removeItem: state.removeItem,
            updateQuantity: state.updateQuantity,
            clear: state.clear,
        })),
    )
}
