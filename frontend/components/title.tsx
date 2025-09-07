interface TitleProps {
    text: string
}

export default function Title({ text }: TitleProps) {
    return (
        <div className="font-semibold text-xl">
            {text}
        </div>
    )
}
