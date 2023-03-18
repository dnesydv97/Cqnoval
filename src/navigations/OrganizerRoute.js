import React, {useEffect} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {OrganizerDrawer} from 'components';
import {navScreenNames} from 'constant';
import {useDispatch} from 'react-redux';
import {BusinessDueDateScreen, GoalScreen, MailComposeScreen, MeetingScreen, OutBoxScreen, SentScreen, TaskScreen} from 'scenes';

const Drawer = createDrawerNavigator();

const useInitialRender = () => {
    const [isInitialRender, setIsInitialRender] = React.useState(false);

    if(!isInitialRender) {
        setTimeout(() => setIsInitialRender(true), 1);
        return true;
    }
    return false;
};

const OrganizerRoute = () => {
    const isInitialRender = useInitialRender();
    const dispatch = useDispatch();

    return(
        <Drawer.Navigator
            openByDefault={false}
            backBehavior="initialRoute"
            drawerStyle={{width: isInitialRender ? null : '70%'}}
            drawerContent={(props) => <OrganizerDrawer {...props}/>}
            >
            <Drawer.Screen
                name={navScreenNames.NAV_MAIL_COMPOSE_SCREEN}
                component={MailComposeScreen}
            />
            <Drawer.Screen
                name={navScreenNames.NAV_OUTBOX_SCREEN}
                component={OutBoxScreen}
            />
            <Drawer.Screen
                name={navScreenNames.NAV_SENT_SCREEN}
                component={SentScreen}
            />
        </Drawer.Navigator>
    );
};

export default OrganizerRoute;