import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const AnimatedNavButton = ({ to, onClick, className, children, isLink = true }) => {
    return (
        <motion.li
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className={`nav-item ${className.includes('ms-') ? '' : 'ms-2'}`}
        >
            {isLink ? (
                <Link className={`nav-link btn ${className}`} to={to}>
                    {children}
                </Link>
            ) : (
                <button className={`nav-link btn ${className}`} onClick={onClick}>
                    {children}
                </button>
            )}
        </motion.li>
    );
};

export default AnimatedNavButton;