export default function Footer() {
  return (
    <footer className="container mx-auto mt-16 px-6 py-10 text-sm text-brand-neutral-300">
      <div className="flex flex-col items-start justify-between gap-4 border-t border-brand-neutral-600 pt-6 md:flex-row md:items-center">
        <div>© {new Date().getFullYear()} Adroa. All rights reserved.</div>
        <div className="flex gap-4">
          <a href="#" className="hover:text-brand-accent transition-colors duration-200">Security overview</a>
          <a href="#" className="hover:text-brand-accent transition-colors duration-200">Privacy</a>
          <a href="#" className="hover:text-brand-accent transition-colors duration-200">Contact</a>
        </div>
      </div>
    </footer>
  );
}
