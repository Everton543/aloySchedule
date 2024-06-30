import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';


function Navbar() {
  return (
    <nav className={styles.nav}>
      <ul className={styles.ul}>
        <li className={styles.li}><Link className={styles.a} to="/">Home</Link></li>
        <li className={styles.li}><Link className={styles.a}to="/about">About</Link></li>
        <li className={styles.li}><Link className={styles.a} to="/login">Login</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;