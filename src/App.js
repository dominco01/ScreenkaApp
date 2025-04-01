import React, { useState } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import PageNotFound from './Pages/PageNotFound';
import Prestart from './Pages/login/Prestart';
import Start from './Pages/_/Start';
import "./App.css"
import Screenka from './Pages/Screenka';
import PostPage from './Pages/PostPage';
import Uploads from './Pages/Uploads';
import { AuthContextWithDemo } from './Contexts/AuthContextWithDemo';
import MiniPostsPage from './Pages/MiniPostsPage';
import  DayEventPage from './Pages/DayEventPage';
import MiniPostsPagePlus from './Pages/MiniPostsPagePlus';
import Bookmark from './Pages/Bookmark';
import Playground from './Pages/Playground';

/*

TOKEN EXPLAIN
token - priorytet przy stronach dla eventu.
- nie zaznacza ci interakcji
- nie sprawdza ci czy ja masz czy nie, wpuszcza bez konsekwencji

warunek eventa: token || canInteract
wlasciwosc: token do routowania do eventu ktory ktos zapomnial wziac udzial a chce jeszcze mimo ze nie ma time.
token ala transparency ticket for event

funkcjonalosc implementuje rownize "tokenizePage", czyli:
jesli znajdziesz token to bedzie mogl wrocic do tej strony.
Narazie token jest przyznawany hardcodowo.
Docelowo np. 10 tokenow na jedno wejscie do aplikacji. (albo inna, lepsza polityka)

*/

const App = () => {

    const [isDemo,setIsDemo] = useState(false);
    const getPath = (string)=>!isDemo?string:`/demo${string}`;

    return (
            <div className='app-flex-center-v'>
                <div className='app-max-mobile'>
                    <HashRouter basename='/'>
                        <AuthContextWithDemo onDemo={()=>setIsDemo(true)}>
                            <Routes>
                                <Route exact path={getPath("/")} element={<Start />}/>
                                
                                <Route path={getPath("/login")} element={<Prestart />} />
                                <Route path={getPath("/bookmark")} element={<Bookmark />} />
                                <Route path={getPath("/playground")} element={<Playground />}/>

                                {/*<Route path={getPath("/app/:name")} element={<AppPage/>}/>*/}
                                <Route path={getPath("/dayevent/:event")} element={<DayEventPage/>}/>
                                <Route path={getPath("/uploads/:type")} element={<Uploads/>}/>
                                <Route path={getPath("/screenka/:host_id")} element={<Screenka />} />
                                
                                <Route path={getPath("/post/:user_fullname/:id")} element={<PostPage />}/> {/*dla kazdego, o ile zna id, z mysla o sharowaniu */}
                                <Route path={getPath("/post/:user_fullname/:id/:event")} element={<PostPage />}/>

                                <Route path={getPath("/posts/:user_fullname/:host_id/:event")} element={<MiniPostsPage/>}/> {/* tylko dla hosta */}
                                <Route path={getPath("/posts/:user_fullname/:host_id/:week_name/:event")} element={<MiniPostsPagePlus/>}/>

                                <Route path="*" element={<PageNotFound />} />
                            </Routes>
                        </AuthContextWithDemo>
                    </HashRouter>
                </div>
            </div>
            )
        }
 
export default App;