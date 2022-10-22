import { Avatar, ListItem, ListItemAvatar, ListItemText } from '@mui/material'
import { Link } from 'react-router-dom'

export const UserCard = ({ user }) => {
    return (


        <ListItem component={Link} to={`/chat/${user.id}`} sx={{ borderBottom: " solid 0.5px #CCC", cursor: 'pointer' }}>
            <ListItemAvatar ><Avatar></Avatar> </ListItemAvatar>
            <ListItemText>{user?.firstName} {user?.lastName}</ListItemText>
        </ListItem>

    )
}
