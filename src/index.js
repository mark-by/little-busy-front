import {createRoot} from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from "react-router-dom";
import {createStore} from "redux";
import {rootReducer} from "./redux/reducers/rootReducer";
import {Provider} from "react-redux";
import { NextUIProvider } from '@nextui-org/react';


const store = createStore(rootReducer);

createRoot(
    document.getElementById('root')
).render(
    <NextUIProvider>
        <Provider store={store}>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </Provider>
    </NextUIProvider>
);

reportWebVitals();