export default function Birthdays() {
    return (
        <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-4">
            <div className="flex justify-between items-center font-medium">
                <span className="text-gray-500">Birthdays</span>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex flex-center gap-4">
                    <img src="https://images.pexels.com/photos/31281265/pexels-photo-31281265/free-photo-of-joyful-woman-near-illuminated-carousel-in-paris.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load" alt="" width={40} height={40} className="w-10 h-10 rounded-full object-cover" />
                    <span className="font-semibold">Bruce Wayne</span>
                </div>

                <div className="flex gap-3 justify-end">
                    <button className="cursor-pointer bg-orange-400 text-white text-xs px-2 py-1 rounded-md">Send greetings</button>
                </div>
            </div>
        </div>
    );
}