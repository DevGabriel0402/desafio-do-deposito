
// Import Lucide Icons (Existing)
import {
    Target, PiggyBank, Wallet, TrendingUp, DollarSign, Landmark,
    Rocket, Star, Heart, Smile, Home, Coffee, Car, Plane,
    Gift, Music, Gamepad2, Briefcase, GraduationCap
} from "lucide-react";

// Import React Icons (New - FontAwesome, Material, etc)
import { FaBitcoin, FaLeaf, FaBuilding, FaMoneyBillWave, FaCoins } from "react-icons/fa";
import { MdAccountBalance, MdSavings, MdAttachMoney, MdShowChart } from "react-icons/md";
import { RiStockFill, RiBankCardFill } from "react-icons/ri";
import { GiPayMoney } from "react-icons/gi";

export const APP_ICONS = {
    // Lucide
    Target, PiggyBank, Wallet, TrendingUp, DollarSign, Landmark,
    Rocket, Star, Heart, Smile, Home, Coffee, Car, Plane,
    Gift, Music, Gamepad2, Briefcase, GraduationCap,

    // React Icons
    FaBitcoin, FaLeaf, FaBuilding, FaMoneyBillWave, FaCoins,
    MdAccountBalance, MdSavings, MdAttachMoney, MdShowChart,
    RiStockFill, RiBankCardFill,
    GiPayMoney
};

export const ICON_OPTIONS = [
    { label: "Alvo", value: "Target", icon: Target },
    { label: "Porquinho", value: "PiggyBank", icon: PiggyBank },
    { label: "Carteira", value: "Wallet", icon: Wallet },
    { label: "Evolução", value: "TrendingUp", icon: TrendingUp },
    { label: "Cifrão", value: "DollarSign", icon: DollarSign },
    { label: "Banco", value: "Landmark", icon: Landmark },
    { label: "Foguete", value: "Rocket", icon: Rocket },
    { label: "Estrela", value: "Star", icon: Star },
    { label: "Coração", value: "Heart", icon: Heart },
    { label: "Casa", value: "Home", icon: Home },
    { label: "Carro", value: "Car", icon: Car },
    { label: "Viagem", value: "Plane", icon: Plane },
    { label: "Presente", value: "Gift", icon: Gift },
    { label: "Lazer", value: "Gamepad2", icon: Gamepad2 },
    { label: "Estudos", value: "GraduationCap", icon: GraduationCap },
    { label: "Bitcoin", value: "FaBitcoin", icon: FaBitcoin },
    { label: "Folha", value: "FaLeaf", icon: FaLeaf },
    { label: "Prédio", value: "FaBuilding", icon: FaBuilding },
    { label: "Dinheiro", value: "FaMoneyBillWave", icon: FaMoneyBillWave },
    { label: "Moedas", value: "FaCoins", icon: FaCoins },
    { label: "Balanço", value: "MdAccountBalance", icon: MdAccountBalance },
    { label: "Economia", value: "MdSavings", icon: MdSavings },
    { label: "Cartão", value: "RiBankCardFill", icon: RiBankCardFill },
];
