import { useState, useEffect } from 'react';
import { Button } from '@mui/material';

const ScrollToTop = () => {
    const [showScrollTopButton, setShowScrollTopButton] = useState(false)

    useEffect(() => {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 300) {
                setShowScrollTopButton(true);
            }
            else {
                setShowScrollTopButton(false);
            }
        });
    }, []);

    const handleGoToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    return (
        <>
            {showScrollTopButton && (
                <Button onClick={handleGoToTop} variant='outlined' sx={{ position: "fixed", bottom: 30, right: 30 }}>Top</Button>
            )}
        </>
    )

};

export default ScrollToTop;