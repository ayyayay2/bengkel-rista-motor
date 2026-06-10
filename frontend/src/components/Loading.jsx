export default function Loading() {
    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-[#eef7fc]">
            <div className="w-12 h-12 border-4 border-[#3d5577] border-t-transparent rounded-full animate-spin mb-4"></div>

            <p className="text-[#3d5577] text-lg font-semibold">
                Loading...
            </p>
        </div>
    );
}