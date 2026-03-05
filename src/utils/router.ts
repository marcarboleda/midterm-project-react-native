import { StackActions, CommonActions } from '@react-navigation/native';

export const getRouter = (navigation: any) => ({
  push: (name: string, params?: object) => {
    navigation.dispatch(StackActions.push(name, params));
  },
  
  replace: (name: string, params?: object) => {
    navigation.dispatch(StackActions.replace(name, params));
  },

  reset: (name: string, params?: object) => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name, params }],
      })
    );
  },

  back: () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.dispatch(StackActions.replace('JobFinderScreen'));
    }
  },
});