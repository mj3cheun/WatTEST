import crypto from 'crypto';

const privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIIEogIBAAKCAQEAtRQdDu+7zX5OmOMKM+3lz6sEfHUD2YjJrqSg2IZq7I9Ozwhm
LoAbWlCyCafKaPuzQTRdOlrlvV41Hl0gGT0UeNv9TBCd3J2iM9QS3FqkTcSx0W2B
OP9nOF96aXFywxXTSGFwAeuK3+fJodu8nt3pZbdcEKU2dgyswUfFXHV5tCrMy2d2
Oi0GlbtKABIqEg4GpCKH9dxg/ULEC/pzVd4kMi5zVuE6+xhRgRvEgYnrM8ehI61/
HoKYDxu+q9fi2Sh+twsVRINGfp+Qv04Et3V939Uo1IluzKeYYP2maM7tJisPmUaL
Eg3EIRSSuKFmxub9aQAiJZZ6kz/heIoUF72O5QIDAQABAoIBAGBq5U4euJEiwBcI
TVZ5RfTdyvW6GOKrwzgK0Np6OFTducjjYAVCkU31ydb6UPy1iS0fBMUdwVaj4wTX
8U9/BneUK7tk3amrBcMzGRfb68C9CzHIbRY8aGnL7RJYJhNae7X+q/VZxgiTEvns
VvMAllZi29LBJc6V0SbZYG1q3/LeMd+PAJ27WmX8zL3Os3vx/y5alEJE6BEdTx5V
ccQsHG+mBwsiOiuY7qgZE2kbvo5ncBfrI/9TszVyVqCK8jQQOE6d8W7V0Gv9hepp
POnkGiTKbPxAdP5cm219nvEmJlKVz0v+qEcIr7CMHEkd2BWziEzkwZmsmAxwPfhx
fbU/FcECgYEA3xI/cvbkZdzPddZp6D8w5zyIheTyi5BYrCISMBBs4nos6VPGOGWa
OO3gOVtIuySm7TI9xcMTEgHz5BR5IljIjAS69GcHD28P4isOmYyXXSV0Dsoepuup
bIpueeS4ydq8Z4+VD0LvgdFRuUTDDSwAVMShudo/EuaeB6coBQLcvJMCgYEAz877
aHdPumsMFmcySI2wM/FyyO0p2IzrQ/ZQ2GMnig3ofReUGseXBat5FQ1CbDMAUVnR
4ah+/7RgsXzy3K3mQRz2kbA95KYN2T8JuTNPuDJsPVKBbOuLigSfR9+4iIb4j5wx
+wEdJz894lW+4lLdDGjhS1BI1mmMh3kAeSQpKacCgYANMWMXRYrUi26ppXi2B6a4
xle8s4G0x2C3LXyt4wrNijRFyHKcu0WXwFnWipOOnehRdvs4SwVBt2PZRWy0n1Od
FFqKQd2lCAiEc891PV9mXuSySzns3Vsz1CwcgW58Ybdq2I8US/0mTF7s+igfC08p
tEdsWoAIeiM2iKhRQ44SiQKBgEdiseh7++5s8XUMtDBKQ/pD+gtdtR9HoVXyWmlK
/n0lM/Us0Vq1r4JqGikKKgQjLPvFIB0llaLfYsv1wTPfpRY/DdCUO169UEqNphhx
sPP0lkwmeIFjFMcvuUumZay4uNAUdvLjuhEOX4LNs8npbzfhG2uUw8Cr93NeNLRo
oJ9HAoGASIvQIBWaX4yK6fIy9L8LwX/qqrDkNWtZg4ld/Y6DdMKWhmVW1D70WU1t
Mh82PpW6kXMN5C42ZmUrpYQlBQbS4m7d/Qj/u82amH6tcRuJGa066uFOuZDLjSyr
naKeBm20MAFO3A7daPPiZCaiHk55lNAfT9vSEZ+HzhqkWoFe9YI=
-----END RSA PRIVATE KEY-----`;
const typeString = typeof '';

export const decrypt = input => {
	return typeof input === typeString
		? crypto.privateDecrypt({key: privateKey}, new Buffer(input, "base64")).toString("utf8")
		: input;
}

export const decryptRes = (req, res, next) => {
	if(req.body.encrypt) {
		for(var key in req.body) {
			req.body[key] = decrypt(req.body[key]);
		}
		req.body.encrypt = true;
	}

	next();
}
