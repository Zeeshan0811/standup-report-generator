import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css';
import LayoutMain from '../components/LayoutMain';

export default function App({ Component, pageProps }) {
  return (
    <LayoutMain>
      <Component {...pageProps} />
    </LayoutMain>
  );
}
