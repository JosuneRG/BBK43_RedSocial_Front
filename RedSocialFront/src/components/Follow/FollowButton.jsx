// src/components/Follow/FollowButton.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { doFollow, doUnfollow, fetchMyNetwork } from '../../redux/users/usersSlice';

const FollowButton = ({ targetUserId, className = '' }) => {
  const dispatch = useDispatch();
  const { me, network } = useSelector((s) => s.users);
  const authUser = useSelector((s) => s.auth.user);

  const [busy, setBusy] = useState(false);

  const myId = me?._id || authUser?._id || null;
  const isMe = useMemo(
    () => myId && targetUserId && String(myId) === String(targetUserId),
    [myId, targetUserId]
  );

  const isFollowing = useMemo(() => {
    const list = network?.following || [];
    // cada item puede ser {_id, username...} o un id plano si fue placeholder
    return list.some((u) => String(u?._id || u) === String(targetUserId));
  }, [network, targetUserId]);

  useEffect(() => {
    // si no tenemos la red cargada, la pedimos
    if (myId && (!network || !Array.isArray(network.following))) {
      dispatch(fetchMyNetwork());
    }
  }, [dispatch, myId, network]);

  if (!targetUserId || isMe) return null; // no mostrar botón para uno mismo

  const onToggle = async () => {
    if (!authUser) return alert('Inicia sesión para seguir a otros usuarios');
    try {
      setBusy(true);
      if (isFollowing) {
        await dispatch(doUnfollow(targetUserId));
      } else {
        await dispatch(doFollow(targetUserId));
      }
      // Refresca la red para tener datos completos (username, avatar, counts…)
      await dispatch(fetchMyNetwork());
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      onClick={onToggle}
      disabled={busy}
      className={`follow-btn ${isFollowing ? 'following' : ''} ${className}`}
      title={isFollowing ? 'Dejar de seguir' : 'Seguir'}
      style={{
        padding: '.45rem .8rem',
        borderRadius: '8px',
        border: isFollowing ? '1px solid #ddd' : '1px solid #0a66ff',
        background: isFollowing ? '#f7f7f7' : '#f0f6ff',
        color: isFollowing ? '#333' : '#0a66ff',
        cursor: busy ? 'not-allowed' : 'pointer',
        fontWeight: 600,
        opacity: busy ? 0.7 : 1,
      }}
    >
      {busy ? '...' : isFollowing ? 'Siguiendo' : 'Seguir'}
    </button>
  );
};

export default FollowButton;
