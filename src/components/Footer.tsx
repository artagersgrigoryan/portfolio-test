export const Footer = () => {
  return (
    <footer className="py-6 px-4 md:px-8 lg:px-16 border-t border-border">
      <div className="container mx-auto text-center text-gray-400">
        <p>&copy; {new Date().getFullYear()} Artagers Grigoryan. All Rights Reserved.</p>
      </div>
    </footer>
  );
};