import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

import useAuth from 'hooks/useAuth';
import { isMasterUser } from 'utils/permissions';

export default function MasterRoute({ children }) {
  const { user } = useAuth();

  return isMasterUser(user) ? children : <Navigate to="/" replace />;
}

MasterRoute.propTypes = {
  children: PropTypes.node
};
