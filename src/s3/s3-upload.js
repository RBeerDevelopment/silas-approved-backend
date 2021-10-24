const AWS = require('aws-sdk');
const config = require('./config');

const path = require('path');
const { v4: uuid } = require('uuid');

function uuidFilenameTransform(filename = '') {
    const fileExtension = path.extname(filename);

    return `${uuid()}${fileExtension}`;
}

class S3Uploader {
    constructor(uploderConfig) {
        const {
            baseKey = '',
            uploadParams = {},
            concurrencyOptions = {},
            filenameTransform = uuidFilenameTransform,
        } = uploderConfig;

        this._s3 = new AWS.S3(config.s3);
        this._baseKey = baseKey.replace('/$', '');
        this._baseUri =
            'https://silas-approved-images.s3.eu-central-1.amazonaws.com/';
        this._filenameTransform = filenameTransform;
        this._uploadParams = uploadParams;
        this._concurrencyOptions = concurrencyOptions;
    }

    async upload(stream, { filename, mimetype }) {
        const transformedFilename = this._filenameTransform(filename);

        const { Location } = await this._s3
            .upload(
                {
                    ...this._uploadParams,
                    Body: stream,
                    Key: `${this._baseKey}/${transformedFilename}`,
                    ContentType: mimetype,
                },
                this._concurrencyOptions
            )
            .promise();

        return Location;
    }

    async delete(uri) {
        uri = uri.replace(this._baseUri, '');
        await this._s3.deleteObject({ Key: uri }).promise();
    }
}
module.exports = {
    s3uploader: new S3Uploader({
        baseKey: 'sticker-image',
        uploadParams: {
            CacheControl: 'max-age:31536000',
            ContentDisposition: 'inline',
        },
    }),
    uuidFilenameTransform,
};
