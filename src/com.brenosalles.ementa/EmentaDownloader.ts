import fetch from "node-fetch";
import FormData from "form-data";
import {
    createReadStream,
    createWriteStream
} from "fs";

const downloadEmentaPdf = async (fileDest: string): Promise < string > => {
    return new Promise < string > (async (resolve, reject) => {
        const res = await fetch(`http://www.ipv.pt/sas/ementas/ESTGV.pdf`);
        const writeStream = createWriteStream(`${fileDest}`);
        writeStream.on("ready", () => {
            res.body.pipe(writeStream);
        });
        writeStream.on("error", e => {
            reject(e);
        });
        return writeStream.on("close", () => {
            resolve(fileDest);
        });
    });
}

const downloadFile = (fileId: number, fileDest: string): Promise < string > => {
    return new Promise < string > (async (resolve, reject) => {
        const headers = {
            "Authorization": "Basic " + Buffer.from(`${process.env.API_KEY}:`).toString("base64")
        }
        const res = await fetch(`https://${process.env.API_URL_PREFIX}.zamzar.com/v1/files/${fileId}/content`, {
            headers: headers
        });
        const writeStream = createWriteStream(`${fileDest}`);
        writeStream.on("ready", () => {
            res.body.pipe(writeStream);
        });
        writeStream.on("error", e => {
            reject(e);
        });
        return writeStream.on("close", () => {
            resolve(fileDest)
        });
    });
}

const startConversionJob = async (fileUrl: string): Promise < any > => {
    const formData: FormData = new FormData();
    formData.append("target_format", "xlsx");
    formData.append("source_file", createReadStream(`${fileUrl}`));

    const headers = {
        "Authorization": "Basic " + Buffer.from(`${process.env.API_KEY}:`).toString("base64")
    }

    const response = await fetch(`https://${process.env.API_URL_PREFIX}.zamzar.com/v1/jobs/`, {
        method: "POST",
        headers: headers,
        body: formData
    });
    return response.json();
}

const waitConversionJob = (fileId: number) => {
    return new Promise((resolve, reject) => {

    });
}

const checkConversionJob = async (fileId: number): Promise < any > => {
    const headers = {
        "Authorization": "Basic " + Buffer.from(`${process.env.API_KEY}:`).toString("base64")
    }
    const response = await fetch(`https://${process.env.API_URL_PREFIX}.zamzar.com/v1/jobs/${fileId}`, {
        headers: headers
    });
    return response.json();
}


const getAllFiles = async (): Promise < any > => {
    const headers = {
        "Authorization": "Basic " + Buffer.from(`${process.env.API_KEY}:`).toString("base64")
    }
    const response = await fetch(`https://api.zamzar.com/v1/files/`, {
        headers: headers
    });
    return response.json();
}

const deleteFile = async (fileId: number): Promise < any > => {
    const headers = {
        "Authorization": "Basic " + Buffer.from(`${process.env.API_KEY}:`).toString("base64")
    }
    const response = await fetch(`https://api.zamzar.com/v1/files/${fileId}`, {
        method: "DELETE",
        headers: headers
    });
    return response.json();
}

export {
    downloadEmentaPdf,
    downloadFile,
    startConversionJob,
    checkConversionJob,
    getAllFiles,
    deleteFile
};