export default function YouTubeEmbed({ videoId }: { videoId: string }) {
    return (
        <div className="relative w-full pb-[56.25%] rounded overflow-clip">
            <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
            ></iframe>
        </div>
    );
}
