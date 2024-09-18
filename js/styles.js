const styles = {
    cardStyle: {
        position: "absolute",
        display: "grid",
        gridTemplateAreas: `
            "title title title"
            "icon description wind"
            "main . speed"
            "temperature humidity pressure"
            "coordinate coordinate coordinate"

        `,
        justifyItems: "center",   // Centers content horizontally
        alignItems: "center",     // Centers content vertically
        gridTemplateRows: "40px auto auto 40px",
        gridTemplateColums: "auto auto auto",
        gap: "20px",
        width: "500px",
        height: "auto",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        boxShadow: "2px 2px 10px #000",
        background: "#eee",
        borderRadius: "10px",
        fontSize: "30px",
        fontWeight: "bold",
        padding: "20px",
    },
    iconStyle: {
        width: "100px",
        height: "100px",
        filter: "drop-shadow(0 0 5px #000)",
        gridArea: "icon",
    },
    preloaderStyle: {
        textAlign: "center",
        fontSize: "30px",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        color: "#000",
        fontSize: "30px",
        fontWeight: "bold",
    },
    compassStyle: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: "-1",
        width: "80%",
        height: "80%",
        opacity: "0.1",
        objetFit: "cover",
        objectPosition: "center",
        gridArea: "compass",
    },
    titleStyle: {
        position: "realative",
        width: "100%",
        textAlign: "center",
        fontSize: "30px",
        color: "#000",
        opacity: '0.7',
        gridArea: "title",
    },
    temperatureStyle: {
        fontSize: "20px",
        color: "#000",
        opacity: '0.7',
        gridArea: "temperature",
    },
    windStyle: {
        position: "relative",
        width: "100px",
        height: "100px",
        fontSize: "20px",
        color: "#000",
        opacity: '0.7',
        gridArea: "wind",
    },
    windDirectionStyle: {
        position: "absolute",
        inset: "0",
        zIndex: "-1",
        width: "100%",
        height: "100%",
        opacity: "0.7",
        objetFit: "cover",
        objectPosition: "center",
    },
    windArrowStyle: {
        width : "100%",
        height: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        color: "red",
        top: "50%",
        left: "50%",
        fontSize: "120px",
    },
    speedStyle: {
        fontSize: "20px",
        color: "#000",
        opacity: '0.7',
        gridArea: "speed",
    },
    mainStyle:{
        fontSize: "20px",
        color: "#000",
        opacity: '0.7',
        gridArea: "main",
    },
    descriptionStyle:{
        fontSize: "20px",
        color: "#000",
        fontWeight: "bold",
        opacity: '0.7',
        gridArea: "description",
        textAlign: "center",
    },
    coordinateStyle:{
        fontSize: "20px",
        color: "#000",
        opacity: '0.7',
        gridArea: "coordinate",
        textAlign: "center",
    },
    humidityStyle:{
        fontSize: "20px",
        color: "#000",
        opacity: '0.7',
        gridArea: "humidity",
        textAlign: "center",
    },
    pressureStyle:{
        fontSize: "20px",
        color: "#000",
        opacity: '0.7',
        gridArea: "pressure",
        textAlign: "center",
    },
    bannerStyle:{
        fontSize: "30px",
        color: "#000",
        opacity: '0.7',
        textAlign: "center",
    }
}

export default styles