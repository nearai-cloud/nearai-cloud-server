import { runServer } from "../../src/server/app";
import axios from "axios";

describe('', () => {
  runServer();

  test('test', async () => {
    const res =  await axios.get('http://localhost:3001');
    console.log(res.data);
  });
})
