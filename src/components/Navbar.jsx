const Navbar = () => (
    <nav className="fixed top-0 w-full bg-white shadow z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-amber-600">Mashua The Chef</h1>
            <div className="space-x-6">
                {["Home", "About", "Gallery", "Services", "Testimonials", "Contact"].map((item) => (
                  <a href={`#${item.toLowerCase()}`} className="text-gray-700 hover:text-amber-600" key={item}>{item}</a>
                ))}
            </div>
        </div>
    </nav>
)

export default Navbar;