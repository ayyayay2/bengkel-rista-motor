export default function PageHeader({ title, description, children }) {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div>
                {title && (
                    <h2 className="text-[24px] font-bold text-black">
                        {title}
                    </h2>
                )}

                {description && (
                    <p className="text-[15px] text-gray-500 mt-1">
                        {description}
                    </p>
                )}
            </div>

            {children && (
                <div>
                    {children}
                </div>
            )}
        </div>
    );
}