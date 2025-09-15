import { BASE_URL, clientServer } from '@/config';
import DashboardLayout from '@/layout/DashboardLayout';
import UserLayout from '@/layout/UserLayout';
import React, { useEffect, useState } from 'react'
import styles from "./index.module.css"
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPosts } from '@/config/redux/action/postAction';
import { getConnectionsRequest, getMyConnectionRequests, sendConnectionRequest } from '@/config/redux/action/authAction';

export default function ViewProfilePage({userProfile}) {

  const router = useRouter();
  const postReducer = useSelector((state) => state.postReducer);
  const dispatch = useDispatch();


  const authState = useSelector((state) => state.auth)

  // Highlighted addition — Check if the profile belongs to the logged-in user
  const isOwnProfile = userProfile.userId._id === authState.user?._id;

  const [userPosts, setUserPosts] = useState([]);

  const [isCurrentUserInConnection, setIsCurrentUserInConnection] = useState(false);

  const[isConnectionNull, setIsConnectionNull] = useState(true);


  const getUserPost = async () => {
    await dispatch(getAllPosts());
    await dispatch(getConnectionsRequest({token: localStorage.getItem("token")}));
    await dispatch(getMyConnectionRequests({token: localStorage.getItem("token")}));
  }


  useEffect(() => {
    let post = postReducer.posts.filter((post) => {
      return post.userId.username === router.query.username
    })

    setUserPosts(post);
  }, [postReducer.posts])


//   useEffect(() => {
//   if (!userProfile?.userId?._id || !authState?.connections?.length) return;

//   const connection = authState.connections.find(user => {
//     const connId = typeof user.connectionId === 'string' ? user.connectionId : user.connectionId?._id;
//     return connId === userProfile.userId._id;
//   });

//   if (connection) {
//     setIsCurrentUserInConnection(true);
//     setIsConnectionNull(!connection.status_accepted); // pending if null or false
//   } else {
//     setIsCurrentUserInConnection(false);
//   }


//   if(authState.connectionRequest.some(user => user.userId._id === userProfile.userId._id)) {
//     setIsCurrentUserInConnection(true);
//     if(authState.connectionRequest.some(user => user.userId._id === userProfile.userId._id).status_accepted === true) {
//       setIsConnectionNull(false)
//     }
//   }


// }, [authState.connections, userProfile, authState.connectionRequest]);



useEffect(() => {
  const profileUserId = userProfile.userId._id;

  // ✅ 1. Check if the profile is already in your connection list
  const connection = authState.connections.find(conn => {
    const connId = typeof conn.connectionId === 'string' ? conn.connectionId : conn.connectionId?._id;
    return connId === profileUserId;
  });

  if (connection) {
    setIsCurrentUserInConnection(true);
    setIsConnectionNull(!connection.status_accepted); // 'pending' if false/null
    return; // ✅ Return early if connected
  }

  // ✅ 2. Else, check if you sent a request that hasn't been accepted yet
  const request = authState.connectionRequest.find(req => req.userId._id === profileUserId);

  if (request) {
    setIsCurrentUserInConnection(true);
    setIsConnectionNull(!request.status_accepted); // pending/accepted
  }

}, [authState.connections, authState.connectionRequest, userProfile.userId._id]);





  useEffect(() => {
    getUserPost();
  }, []);


  return (
    <UserLayout>
      <DashboardLayout> 
        <div className= {styles.container}>
          <div className= {styles.backDropContainer}>
            <img className= {styles.backDrop} src = {`${BASE_URL}/${userProfile.userId.profilePicture}`} alt='backdrop'/>
          </div>

          <div className= {styles.profileContainer__details}>
            <div className={styles.profileContainer__fle}>
              <div style={{flex: "0.8"}}>
                <div style={{display: "flex", width: "fit-content", alignItems: "center", gap: "1.2rem"}}>
                  <h2>{ userProfile.userId.name }</h2>
                  <p style={{color: "grey"}}>@{userProfile.userId.username}</p>
                </div>


                
                <div style={{display: "flex", alignItems: "center", gap: "1.2em"}}>

                    {isOwnProfile ? (
                      <button className={styles.connectedButton} disabled>
                        This is You
                      </button>
                    ) : isCurrentUserInConnection ? (
                      <button className={styles.connectedButton}>
                        {isConnectionNull ? "Pending" : "Connected"}
                      </button>
                    ) : (
                      <button
                        onClick={async () => {
                          await dispatch(sendConnectionRequest({
                            token: localStorage.getItem("token"),
                            connectionId: userProfile.userId._id
                          }));

                          // Re-fetch updated connection list to reflect status change
                          await dispatch(getConnectionsRequest({ token: localStorage.getItem("token") }));
                        }}
                        className={styles.connectBtn}
                      >
                        Connect
                      </button>
                    )}



                    <div onClick={async () => {
                      const response = await clientServer.get(`/user/download_resume?id=${userProfile.userId._id}`);
                      window.open(`${BASE_URL}/${response.data.message}`, "_blank")
                    }} style={{cursor: "pointer"}}>

                      <svg style={{width: "1.2em"}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                      </svg>



                    </div>

                </div>


                <div>
                  <p>{userProfile.bio}</p>
                </div>

              </div>


              <div style={{flex: "0.2"}}>

                <h3>Recent Activity</h3>
                {userPosts.map((post) => {
                  return (
                    <div key={post._id} className= {styles.postCard}> 
                      <div className= {styles.card}> 
                        <div className= {styles.card__profileContainer}> 
                          {post.media !== "" ? <img src = {`${BASE_URL}/${post.media}`} alt=''/> : <div style={{width: "3.4rem", height: "3.4rem"}}> </div>}
                        </div>

                        <p>{post.body}</p>

                      </div>
                    </div>
                  )
                })}

              </div>
            </div>
          </div>


          <div className="workHistory">
            <h4>Work History</h4>

            <div className= {styles.workHistoryContainer}> 
              {
                userProfile.pastWork.map((work, index) => {
                  return (
                    <div key={index} className= {styles.workHistoryCard}>
                      <p style={{fontWeight: "bold", display: "flex", alignItems: "center", gap: "0.8rem"}}>{work.company} - {work.position}</p> 
                      <p>{work.years}</p>

                    </div>
                  )
                })
              }

            </div>

          </div>



        </div>
      </DashboardLayout>
    </UserLayout>
      
  )
}


export async function getServerSideProps(context) {

  console.log("From View");
  console.log(context.query.username);

  const request = await clientServer.get("/user/get_profile_based_on_username", {
    params: {
      username: context.query.username
    }
  })

  const response = await request.data;
  console.log(response);



  return { props: {userProfile : request.data.profile} }

}