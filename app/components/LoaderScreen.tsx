const LoaderScreen = () => {
    return (
        <div
            id={"loader-screen"}
            className="w-screen h-screen bg-black grid place-content-center fixed inset-0 z-50 font-serif"
        >
            <svg viewBox="0 0 400 400">
                <text name="text-body" x="40%" y="40%" text-anchor="middle">
                    Karel
                </text>
                <text
                    name="text-body"
                    x="50%"
                    y="40%"
                    dy="0.9em"
                    text-anchor="middle"
                >
                    &
                </text>
                <text
                    name="text-body"
                    x="60%"
                    y="40%"
                    dy="1.9em"
                    text-anchor="middle"
                >
                    Sabrina
                </text>
            </svg>
        </div>
    );
};

export default LoaderScreen;
