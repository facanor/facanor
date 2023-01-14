const Options = ({ name, state, toggleFunction, disabled }) => {
    return (
        <li className="nav-li">
            <button
                type="button"
                className="btn btn-default"
                title={name}
                onClick={() => toggleFunction(!state)}
                disabled={disabled === true ? true : ""}
            >
                <p className="navbar-p">{name}</p>
            </button>
        </li>
    );
};

export default Options;
