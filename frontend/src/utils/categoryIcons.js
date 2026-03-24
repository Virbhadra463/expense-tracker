import {
    Wallet, ShoppingBag, Car, Film, Printer, Utensils
} from 'lucide-react';

const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
        case 'food': return Utensils;
        case 'shopping': return ShoppingBag;
        case 'transport': return Car;
        case 'entertainment': return Film;
        case 'bills': return Printer;
        default: return Wallet;
    }
};

export default getCategoryIcon;
