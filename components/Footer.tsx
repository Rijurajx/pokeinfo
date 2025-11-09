import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 backdrop-blur-sm mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            Powered by{" "}
            <Link
              href="https://pogoapi.net"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-secondary transition-colors duration-300"
            >
              PogoAPI.net
            </Link>
          </div>
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Pokémon GO Database. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
