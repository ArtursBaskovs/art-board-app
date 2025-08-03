import { useBoardFetch } from "../../api/mysqlDBapi";
import LocallBoardLoader from "./LocallBoardLoader";
import ServerBoardLoader from "./ServerBoardLoader";
import { useEffect, useState } from "react";
import { useBoardLink } from "./hooks/HandleLinks";


const BoardLoader: React.FC = () => {
    const [tab, setTab] = useState<'ServerBoardLoader' | 'LocallBoardLoader'>('LocallBoardLoader');
    const {baseLink, boardPath, boardIDlink} = useBoardLink();

    const styles = {
        visible: { display: "block" },
        hidden: { display: "none" }
    };
    
    useEffect(() => {
        if(boardPath && boardIDlink) setTab('ServerBoardLoader');
        console.log(boardPath, boardIDlink);
    }, [boardPath, boardIDlink]);

    return (
        <>
        <div className="description-text">
            <p>Board Storage</p>
        </div>
        
        <div className="board-loader-switch">
            <button 
              className={tab == "ServerBoardLoader" ? "active-true" : ""}
              onClick={() => setTab('ServerBoardLoader')}
            >
                Server
            </button>
            <button 
              className={tab == "LocallBoardLoader" ? "active-true" : ""}
              onClick={() => setTab('LocallBoardLoader')}>
                Locall
            </button>
        </div>

        <div className="board-loader-tab">
            <div style={tab === "ServerBoardLoader" ? styles.visible : styles.hidden}>
                <ServerBoardLoader/>
            </div>
            <div style={tab === "LocallBoardLoader" ? styles.visible : styles.hidden}>
                <LocallBoardLoader />
            </div>
        </div>

        
        </>
    )
}
export default BoardLoader;