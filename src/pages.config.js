import AssistenteNutricao from './pages/AssistenteNutricao';
import Home from './pages/Home';
import MeuAcompanhamento from './pages/MeuAcompanhamento';
import Videos from './pages/Videos';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AssistenteNutricao": AssistenteNutricao,
    "Home": Home,
    "MeuAcompanhamento": MeuAcompanhamento,
    "Videos": Videos,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};