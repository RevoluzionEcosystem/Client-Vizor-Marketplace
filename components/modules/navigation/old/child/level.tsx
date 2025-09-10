import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

import NavChild from "."
import NavChildModal from "./modal"

export default function NavChildLevel({
    list,
    open,
    title,
    link,
    pathName,
    className,
    titleClass,
    separatorClass,
    size,
    asChild,
    modalTitle,
    modalDescription,
    modalContent,
    onClick
}: {
    list
    open
    title
    link
    pathName
    className?
    titleClass?
    separatorClass?
    size?
    asChild?
    modalTitle?
    modalDescription?
    modalContent?,
    onClick?
}) {
    return (
        <Accordion type="single" collapsible defaultValue="item-1">
            <AccordionItem value="item-1" className="border-none">                <AccordionTrigger className="py-0 px-2 rounded-md hover:no-underline hover:text-accent hover:bg-accent/20">
                    <div className={`${titleClass} grid grid-cols-[auto_1fr] font-light items-center gap-2 w-full mr-1 py-0`}>
                        <div className="font-bold text-xs flex items-center">
                            {`${title}`}
                        </div>
                        <Separator className={`${separatorClass} my-auto`} />
                    </div>
                </AccordionTrigger>
                <AccordionContent className="p-0">
                    {list.length > 0 && list.map((item, index) => (
                        item.type === "modal" ? (
                            <NavChildModal
                                key={index}
                                id={`${item.id}`}
                                title={item.title}
                                link={`${item.link}`}
                                pathName={pathName}
                                className={className}
                                modalTitle={modalTitle}
                                modalDescription={modalDescription}
                                modalContent={modalContent}
                                onClick={onClick}
                            />
                        ) : (
                            item.child.length > 0 ? (
                                <NavChildLevel
                                    key={index}
                                    list={item.child}
                                    open={true}
                                    title={`${item.title}`}
                                    link={link}
                                    pathName={pathName}
                                    className={className}
                                    titleClass={titleClass}
                                    separatorClass={separatorClass}
                                    size={size}
                                    asChild={asChild}
                                    onClick={onClick}
                                />
                            ) : (                            <NavChild
                                key={index}
                                id={`${item.id}`}
                                title={`${item.title}`}
                                link={`${item.link}`}
                                type={`${item.type}`}
                                pathName={pathName}
                                className={className}
                                size={size}
                                asChild={asChild}
                                onClick={onClick}
                            />
                            )
                        )
                    ))}
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}