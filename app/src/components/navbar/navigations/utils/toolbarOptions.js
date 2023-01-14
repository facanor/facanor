const ToolbarOptions = ({ name, iconClass, onClick, shown }) => {
    return (
        <li className="nav-li" onClick={() => onClick(!shown)}>
            <button type="button" className="btn btn-default" title={name}>
                <i className={iconClass}></i>
            </button>
        </li>
    );
};

export default ToolbarOptions;
