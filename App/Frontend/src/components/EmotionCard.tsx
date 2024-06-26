type Props = {
    emotionName: string;
    image: string;
    onClick: () => void;
}

export const EmotionCard = (props: Props) => {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                minHeight: "60px",
                width: "calc(100% - 20px)",
                padding: "0 10px",
                backgroundColor: `var(--${props.emotionName.toLowerCase()})`,
                borderRadius: "10px",
                cursor: "pointer",
            }}
            onClick={props.onClick}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    height: "100%",
                    width: "50px",
                    padding: "0 10px",
                }}
            >
                <img
                    src={props.image}
                    alt={props.emotionName}
                    style={{
                        height: "50px",
                        width: "50px",
                    }}
                />
            </div>

            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    width: "calc(100% - 80px)",
                    padding: "0 10px",
                    color: "var(--black)",
                    fontSize: "24px",
                }}
            >
                {props.emotionName}
            </div>
        </div>
    );
}