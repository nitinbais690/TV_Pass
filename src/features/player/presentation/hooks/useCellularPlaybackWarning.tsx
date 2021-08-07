import { NetInfoStateType } from '@react-native-community/netinfo';
import { useNavigation } from '@react-navigation/native';
import { useAlert } from 'contexts/AlertContext';
import { useLocalization } from 'contexts/LocalizationContext';
import { useNetworkStatus } from 'contexts/NetworkContextProvider';
import { useEffect, useState } from 'react';
import { Player } from 'rn-qp-nxg-player';
import { canStreamOverCellular } from 'utils/UserPreferenceUtils';

export const useCellularPlaybackWarning = (player: Player | null) => {
    const { Alert } = useAlert();
    const navigation = useNavigation();
    const { strings } = useLocalization();
    const { type } = useNetworkStatus();
    const [canStreamOverCellularState, setCanStreamOverCellularState] = useState<boolean | undefined>();

    useEffect(() => {
        const init = async () => {
            setCanStreamOverCellularState(await canStreamOverCellular());
        };
        init();
    }, []);

    useEffect(() => {
        if (player && canStreamOverCellularState === false && type === NetInfoStateType.cellular) {
            player.stop();

            Alert.alert(
                strings['playback.error.wifi_only'],
                undefined,
                [
                    {
                        text: strings['global.okay'],
                        onPress: () => {
                            navigation.goBack();
                        },
                    },
                ],
                {
                    cancelable: false,
                },
            );
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [player, canStreamOverCellularState, type]);
};
