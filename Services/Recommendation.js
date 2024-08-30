const { exec } = require('child_process');
const fs = require('fs');

function handleRecommendation(req, res){
    const userId = req.body.user_id;
    const productData = req.body.product_data;

    const csvData = productData.map(row => 
        `${row.user_id},${row.product_id},${row.product_name},${row.view_time},${row.visit_count},${row.liked}`
    ).join('\n');
    const tempFilePath = `Services/input_data_${userId}.csv`;
    fs.writeFileSync(tempFilePath, `user_id,product_id,product_name,view_time,visit_count,liked\n${csvData}`);
    // console.log(tempFilePath)
    exec(`python3 Services/recommendation.py ${tempFilePath}`, (error, stdout, stderr) => {
        fs.unlinkSync(tempFilePath);

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
}

module.exports ={
    handleRecommendation
}