import { Accordion, type AccordionItem } from '@/components/shared/Accordion'
import { useFillPlaceholders, useSiteContent } from '@/utils/hooks/useSiteContent'

export function ContactFaq() {
    const { contactPage } = useSiteContent()
    const fill = useFillPlaceholders()
    const items: AccordionItem[] = contactPage.faq.map((item, index) => ({
        id: `faq-${index}`,
        question: fill(item.question),
        answer: fill(item.answer),
    }))

    return <Accordion items={items} />
}
