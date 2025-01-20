import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter, Route , Routes} from 'react-router-dom';
import Login from './Login/Login';
import SignUp from './SignUp/SignUp';
import Home from './Home/Home.js';
import Reset from './Reset/Reset';
import UpdateSuccessfully from './UpdateSuccessfully/UpdateSuccessfully';
import CodeVerification from './CodeVerification/CodeVerification';
import Demo from './CompanyDetails/Demo/Demo.js';
import SignUpMember from './MemberComponent/SignUp/SignUpMember.js';
import LoginMember from './MemberComponent/Login/LoginMember.js';
import ResetMember from './MemberComponent/Reset/Reset.js';
import MemberUpdateSuccessfully from './MemberComponent/UpdateSuccessfully/UpdateSuccessfully.js';
import MemberHome from './MemberComponent/MemberHome/MemberHome.js';
import ProtectedRoute from './ProtectedRoute/ProtectedRoute.js';
import RedirectIfAuthenticated from './ProtectedRoute/RedirectIfAuthenticated.js';
import MemberRedirectIfAuthenticated from './MemberComponent/MemberProtectedRoute/MemberRedirectIfAuthenticated.js';
import MemberProtectedRoute from './MemberComponent/MemberProtectedRoute/MemberProtectedRoute.js';
import MemberCodeVerification from './MemberComponent/CodeVerification/MemberCodeVerification.js';
import AQ from './AccountPayable/AQ/AQ.js';
import PendingBills from './AccountPayable/Bills/PendingBills/PendingBills.js';
import ApprovedBills from './AccountPayable/Bills/ApprovedBills/ApprovedBills.js';
import DeclineBills from './AccountPayable/Bills/DeclineBills/DeclineBills.js';
import AllBills from './AccountPayable/Bills/AllBills/AllBills.js';
import AllVendorForm from './AccountPayable/VendorForm/AllVendorForm/AllVendorForm.js';
import { ZegoExpressEngine } from 'zego-express-engine-webrtc';
import io from 'socket.io-client'
import axios from "axios";
import { apiEndPointUrl } from './utils/apiService.js';
import { CloseFullscreen } from '@mui/icons-material';
import Cookies from "js-cookie";
import SimplePeer from 'simple-peer';

const App = () => {
  

//   useEffect(() => {

//     socket.current = io('http://localhost:9000');

//     // Register user after socket connects
    // socket.current.on('connect', () => {
    //     const email = Cookies.get("workEmail");
    //     console.log(email)
    //     if (email) {
    //         getUser(email).then((userId) => {
    //             if (userId) {
    //               userID=userId.userId
    //                 socket.current.emit('registerUser', userID);
    //             }
    //         });
    //     }
    // }); 
    // const getUser = async (email) => {
    //   try {
    //     const response = await axios.get(`${apiEndPointUrl}/getUser`, {params:{email:email}} );
    //     return response.data
    //   } catch (error) {
    //     console.log("Error fetching chats:", error);
    //   }
    // };
//     // Initialize ZEGOCLOUD engine
//     const zegoEngine = new ZegoExpressEngine(1028243995, "f45c464046c0da90b2f8de1fd77b2df1");
//     const result =  zegoEngine.checkSystemRequirements();
// // The [result] indicates whether it is compatible. It indicates WebRTC is supported when the [webRTC] is [true]. For more results, see the API documents.
// result
//   .then((data) => {
//     console.log("Result:", data); // Log the resolved value of the promise
//   })
//   .catch((error) => {
//     console.error("Error:", error); // Log any error that occurs
//   });    // setEngine(zegoEngine);
//     engine=zegoEngine
//       // Listen for incoming calls
//       socket.current.on('incomingCall', ({ from }) => {
//           setIncomingCall({ from });
//       });


//       return () => {
//         if (socket.current) {
//             socket.current.disconnect();
//         }
//     };  
//   }, []);

  // const acceptCall = async () => {
  //     if (!incomingCall) return;
  //     const token = "04AAAAAGeHwtAADCP2OAFrPtSv1k5kEgCvQfWnoOsTtI1iHkihdIdM3fzEXnEWAGI0j6OBAf0I9hbWakgCv4ZCz/x+jaFx1z2ZBXFTFw6Xvh6GUOVBThG9w9q9WPlcPCfa8qRXznj/o98/jelADN3bF8zmTCX0eCIKtCA8W1NDKhfhf8uVw1Q5gDfN8n4xS2r+7+VYJZNsr/FYF/8I6ubCZoVFZwcCpGQvRbSyA61+Vj7gK0USwAJ1QrLJ9f6QyP4zSdSnNU0sHAE="
  //     // Join the ZEGOCLOUD 
  //     const id="Fin-3"
  //     const roomId="groupRoom" 

  //     await engine.loginRoom(roomId,token, {userID:id});

  //     // Play the audio streams
  //     engine.on('roomStreamUpdate', (roomID, updateType, streamList) => {
  //       console.log('roomUserUpdate roomID ', roomID, streamList);
  //         if (updateType === 'ADD') {
  //             streamList.forEach((stream) => {
  //                 engine.startPlayingStream(stream.streamID);
  //             });
  //         }
  //     });

  //     setIncomingCall(null);
  // };
  const [incomingCall, setIncomingCall] = useState(null);
  const [currentCall, setCurrentCall] = useState(null); // Current call details
  const [participants, setParticipants] = useState([]); // Participants in the call
  const localStream = useRef(null); // Local video stream
  const remoteVideos = useRef({}); // Remote streams
  const [peers, setPeers] = useState([]);
  const socket = useRef(null);
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    if (currentCall) {
        const remoteVideoContainer = document.getElementById("remote-videos");
        Object.entries(remoteVideos.current).forEach(([id, stream]) => {
            const videoElement = document.createElement("video");
            videoElement.srcObject = stream;
            videoElement.autoplay = true;
            videoElement.playsInline = true;
            videoElement.id = `video-${id}`;
            remoteVideoContainer.appendChild(videoElement);
        });

        return () => {
            while (remoteVideoContainer.firstChild) {
                remoteVideoContainer.removeChild(remoteVideoContainer.firstChild);
            }
        };
    }
}, [currentCall]);                      
  useEffect(() => {
    socket.current = io('http://localhost:9000');
    socket.current.on('connect', () => {
      const email = Cookies.get("workEmail");
      if (email) {
          getUser(email).then((userId) => {
              if (userId) {
                setUserId(userId.userId);
                console.log(userId)
                socket.current.emit('registerUser', userId.userId);
            }
          });
      }
      socket.current.on('incoming-group-call', ({ callerId, participants }) => {
        setIncomingCall({ callerId, participants });
      });
      return () => {
        if (socket.current) {
          socket.current.disconnect();
        }
      };
  }); 
  
  }, []);
  const getUser = async (email) => {
    try {
      const response = await axios.get(`${apiEndPointUrl}/getUser`, {params:{email:email}} );
      return response.data
    } catch (error) {
      console.log("Error fetching chats:", error);
    }
  };
  const startGroupCall = async (selectedParticipants) => {
    const stream = await getMediaStream();
    setCurrentCall({ callerId: userId });
    setParticipants(selectedParticipants);

    selectedParticipants.forEach((participantId) => {
      const peer = new SimplePeer({
        initiator: true,
        trickle: false,
        stream,
        config: { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] },
      });

      peer.on('signal', (signalData) => {
        socket.current.emit('signal-user', {  participantId: participantId, signalData });
      });

      peer.on('stream', (remoteStream) => {
        remoteVideos.current[participantId] = remoteStream;
        setPeers((prev) => [...prev, { id: participantId, peer }]);
        const videoElement = document.createElement('video');
    videoElement.srcObject = remoteStream;
    videoElement.autoplay = true;
    videoElement.playsInline = true;
    videoElement.id = `video-${participantId}`;
    document.getElementById('remote-videos').appendChild(videoElement);
      });

      setPeers((prev) => [...prev, { id: participantId, peer }]);
    });
    socket.current.emit('start-group-call', {
      callerId: userId, // The caller's ID
      participants: selectedParticipants, // List of selected participants
    });
  };

  const acceptCall = async () => {
    const stream = await getMediaStream();
    setCurrentCall({ callerId: incomingCall.callerId });
    setParticipants(incomingCall.participants);

    const peer = new SimplePeer({
      initiator: false,
      trickle: false,
      stream,
      config: { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] },
    });

    peer.on('signal', (signalData) => {
      socket.current.emit('join-group-call', {
        userId,
        signalData,
        callerId: incomingCall.callerId,
        
      });
    });

    peer.on('stream', (remoteStream) => {
      remoteVideos.current[incomingCall.callerId] = remoteStream;
      setPeers((prev) => [...prev, { id: incomingCall.callerId, peer }]);
    });

    socket.current.on('receive-signal', ({ signalData }) => {
      console.log(signalData)
      peer.signal(signalData);
    });

    setIncomingCall(null);
  };

  const declineCall = () => {
    setIncomingCall(null);
  };
  useEffect(() => {
    if (localStream.current) {
        console.log('Local video element is ready.');
    }
}, []);
useEffect(() => {
  const initMedia = async () => {
      if (localStream.current) {
          await getMediaStream();
      }
  };
  initMedia();
}, []);
  const getMediaStream = async () => {
    try {
      const constraints = { video: true, audio: true };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        console.log(stream)
        if (localStream.current) {
          localStream.current.srcObject = stream;
      } else {
        console.error('localStream ref is not attached to a video element.');
      }        return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      alert('Unable to access media devices. Please check permissions.');
      return null;
    }
  };
  const endCall = () => {
    peers.forEach(({ peer }) => peer.destroy());
    setPeers([]);
    setCurrentCall(null);
  };


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={ <RedirectIfAuthenticated> <SignUp/> </RedirectIfAuthenticated> } />
        <Route path="/login" element={ <RedirectIfAuthenticated> <Login /> </RedirectIfAuthenticated> } />
        <Route path="/reset" element={ <RedirectIfAuthenticated> <Reset/></RedirectIfAuthenticated> } />
        <Route path="/update" element={ <RedirectIfAuthenticated><UpdateSuccessfully/> </RedirectIfAuthenticated> } />
        <Route path="/codeVerification" element={ <RedirectIfAuthenticated><CodeVerification/> </RedirectIfAuthenticated> } />
        <Route path='/invoiceQueue' element={ <ProtectedRoute><AQ /></ProtectedRoute>} />
        <Route path='/billAQButton' element={ <ProtectedRoute><PendingBills startGroupCall={startGroupCall} /></ProtectedRoute>} />
        <Route path='/approved-Bills' element={ <ProtectedRoute><ApprovedBills /></ProtectedRoute>} />
        <Route path='/decline-Bills' element={ <ProtectedRoute><DeclineBills /></ProtectedRoute>} />
        <Route path='/all-Bills' element={ <ProtectedRoute><AllBills /></ProtectedRoute>} />
        <Route path='/vendor' element={ <ProtectedRoute><AllVendorForm /></ProtectedRoute>} />
        <Route path="/"  element={ <ProtectedRoute>  <Home /> </ProtectedRoute> }/>
        {/* -----not needed---------- */}
        <Route path="/demo"  element={ <ProtectedRoute><Demo/> </ProtectedRoute> }/>
  

        {/* -------------Members details------------- */}
        {/* <Route path="/signup-member"  element={ <SignUpMember/>} />
        <Route path="/login-member"  element={ <LoginMember/> } />
        <Route path="/reset-member"  element={ <ResetMember/> } />
        <Route path="/update-member"  element={ <MemberUpdateSuccessfully/> } />
        <Route path="/codeVerification-member"  element={ <MemberCodeVerification/> } /> */}

        {/* -------------Members details------------- */}
       <Route path="/signup-member"  element={<MemberRedirectIfAuthenticated> <SignUpMember/></MemberRedirectIfAuthenticated>} />
       <Route path="/login-member"  element={<MemberRedirectIfAuthenticated> <LoginMember/> </MemberRedirectIfAuthenticated>} />
       <Route path="/reset-member"  element={<MemberRedirectIfAuthenticated> <ResetMember/> </MemberRedirectIfAuthenticated>} />
       <Route path="/update-member"  element={<MemberRedirectIfAuthenticated> <MemberUpdateSuccessfully/> </MemberRedirectIfAuthenticated>} />
       <Route path="/codeVerification-member"  element={<MemberRedirectIfAuthenticated> <MemberCodeVerification/> </MemberRedirectIfAuthenticated>} />
       <Route path="/home-member"  element={<MemberProtectedRoute> <MemberHome/> </MemberProtectedRoute>} />

        {/* <Route path="/home-member"  element={<MemberHome/> } /> */}
      </Routes>
      {/* {incomingCall && (
                <div>
                    <h3>Incoming Call from: {incomingCall.from}</h3>
                    <button onClick={acceptCall} style={{ backgroundColor: 'green', color: 'white' }}>
                        Accept
                    </button>
                    <button onClick={declineCall} style={{ backgroundColor: 'red', color: 'white' }}>
                        Decline
                    </button>
                </div>
            )} */}
            {incomingCall && (
        <div className="incoming-call-screen">
          <h3>Incoming Call from: {incomingCall.callerId}</h3>
          <button onClick={acceptCall} style={{ backgroundColor: 'green', color: 'white' }}>
            Accept
          </button>
          <button onClick={declineCall} style={{ backgroundColor: 'red', color: 'white' }}>
            Decline
          </button>
        </div>
      )}
      {currentCall && (
    <div>
        <h1>In Call with: {participants.join(', ')}</h1>

        {/* Local Video */}
        <video
            ref={localStream}
            autoPlay
            playsInline
            muted
            style={{ width: '100%', height: 'auto' }}
        />

        {/* Remote Videos */}
        <div id="remote-videos" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {Object.keys(remoteVideos.current).map((participantId) => {
                const stream = remoteVideos.current[participantId];
                return (
                    <video
                        key={participantId}
                        ref={(video) => {
                            if (video) {
                                video.srcObject = stream;
                            }
                        }}
                        autoPlay
                        playsInline
                        style={{ width: '150px', height: 'auto', borderRadius: '5px' }}
                    />
                );
            })}
        </div>

        <button onClick={endCall} style={{ marginTop: '20px', backgroundColor: 'red', color: 'white' }}>
            End Call
        </button>
    </div>
)}
    </BrowserRouter>
    
  );
};

export default App;
