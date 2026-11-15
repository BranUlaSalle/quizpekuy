import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "QuizPekuy - Plataforma de Quiz",
  description: "Plataforma de quiz interactivo con temática de cuy dorado",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
