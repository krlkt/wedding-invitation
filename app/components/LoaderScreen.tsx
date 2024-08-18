const LoaderScreen = () => {
    return (
        <div
            id={"loader-screen"}
            className="w-dvh h-dvh bg-black grid place-content-center fixed inset-0 z-50 font-serif"
        >
            <svg viewBox="0 0 400 400">
                <text
                    name="text-body"
                    x="40%"
                    y="40%"
                    textAnchor="middle"
                    className={"animate-loader"}
                >
                    Karel
                </text>
                <text
                    name="text-body"
                    x="50%"
                    y="40%"
                    dy="0.9em"
                    textAnchor="middle"
                    className={"animate-loader"}
                >
                    &
                </text>
                <text
                    name="text-body"
                    x="60%"
                    y="40%"
                    dy="1.9em"
                    textAnchor="middle"
                    className={"animate-loader"}
                >
                    Sabrina
                </text>
            </svg>
        </div>
    );
};

export default LoaderScreen;
