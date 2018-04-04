import crypto from 'crypto';

const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtRQdDu+7zX5OmOMKM+3l
z6sEfHUD2YjJrqSg2IZq7I9OzwhmLoAbWlCyCafKaPuzQTRdOlrlvV41Hl0gGT0U
eNv9TBCd3J2iM9QS3FqkTcSx0W2BOP9nOF96aXFywxXTSGFwAeuK3+fJodu8nt3p
ZbdcEKU2dgyswUfFXHV5tCrMy2d2Oi0GlbtKABIqEg4GpCKH9dxg/ULEC/pzVd4k
Mi5zVuE6+xhRgRvEgYnrM8ehI61/HoKYDxu+q9fi2Sh+twsVRINGfp+Qv04Et3V9
39Uo1IluzKeYYP2maM7tJisPmUaLEg3EIRSSuKFmxub9aQAiJZZ6kz/heIoUF72O
5QIDAQAB
-----END PUBLIC KEY-----`;
const typeString = typeof '';

export const encrypt = input => {
	return typeof input === typeString
		? crypto.publicEncrypt({key: publicKey}, new Buffer(input)).toString("base64")
		: input;
}

export const encryptRes = (bodyObj) => {
	if(bodyObj.encrypt) {
		for(var key in bodyObj) {
			bodyObj[key] = encrypt(bodyObj[key]);
		}
		bodyObj.encrypt = true;
	}

	return bodyObj;
}
