import http from 'k6/http'
import { check, sleep } from 'k6'

export const options = {
  vus: 2000,
  duration: '1m'
}

const BASE_URL = 'http://localhost:3000'
const COOKIE =
  'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiY3JlYXRlZF9hdCI6IjIwMjUtMDYtMjhUMDM6MzM6MTUuODU5WiIsInVwZGF0ZWRfYXQiOiIyMDI1LTA2LTI4VDAzOjMzOjE1Ljg1OVoiLCJlbWFpbF9pZCI6MSwiZmlyc3RfbmFtZSI6IkZlbGlwZSIsImxhc3RfbmFtZSI6Ik1pcmFuZGEgTWFycmVpcm9zIiwiaWF0IjoxNzUxMDgzNDA2fQ.rbPm6KWuIwQCPP_pDoTenxuuCnkvuaiYZDX-LDlbq88; Path=/;' // substitua pelo valor real

export default function () {
  const res = http.get(`${BASE_URL}/api/wish/`, {
    headers: {
      Cookie: COOKIE
    }
  })

  check(res, {
    'status is 200': (r) => r.status === 200
  })

  sleep(1)
}
