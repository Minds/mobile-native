// import { useEffect, useState } from "react";
// import { reaction } from "mobx";
// import sp from "~/services/serviceProvider";

// export default function useGetAudioQueue() {
//     const service = sp.resolve('audioPlayer');
//     const [queue, setQueue] = useState(() => service.queue);

//     useEffect(() => reaction(() => service.queue, queue => setQueue(queue)), []);

//     return queue;
// }
