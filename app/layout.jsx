// app/layout.jsx
import "@styles/globals.css";
import Nav from "@components/Nav";
import AppProviders from "@components/AppProviders";

export const metadata = {
  title: "PrompptSharingNextjs",
  description: "Discover & Share AI Prompts",
};

const RootLayout = ({ children }) => (
  <html lang='en'>
    <body>
      <AppProviders>
        <div className='main'>
          <div className='gradient' />
        </div>
        <main className='app'>
          <Nav />
          {children}
        </main>
      </AppProviders>
    </body>
  </html>
);

export default RootLayout;