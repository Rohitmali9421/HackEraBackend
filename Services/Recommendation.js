const { exec } = require('child_process');

function handleRecommendation(req, res) {
    const userId = req.body.user_id;
    const productData = req.body.product_data;

    // Convert productData to JSON string
    const jsonData = JSON.stringify(productData);

    // Execute the Python script and pass the JSON data through stdin
    const pythonProcess = exec(`python3 Services/recommendation.py`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing Python script: ${error}`);
            return res.status(500).send('Internal Server Error');
        }
        if (stderr) {
            console.error(`Python script error: ${stderr}`);
            return res.status(500).send('Internal Server Error');
        }
        const output = stdout.trim();
        res.send(output);
    });

    // Write the JSON data to the Python script's stdin
    pythonProcess.stdin.write(jsonData);
    pythonProcess.stdin.end();
}

module.exports = {
    handleRecommendation
};
