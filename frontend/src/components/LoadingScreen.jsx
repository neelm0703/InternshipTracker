export default function LoadingScreen({ message = "Loading..." }) {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-950">
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
                <p className="text-white text-sm tracking-wide">{message}</p>
            </div>
        </div>
    )
}