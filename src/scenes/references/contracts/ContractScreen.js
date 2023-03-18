import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import { BaseCard, BaseContainer, ReferenceSearchBox } from 'components';
import { navScreenNames } from 'constant';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { IconOutline } from '@ant-design/icons-react-native';
import { AppColors, AppDimensions } from 'styles';
import { moderateScale } from 'react-native-size-matters';

const ContractScreen = () => {
    return(
        <View>
            <ReferenceSearchBox/>
            <View style={{borderWidth: 0.4, top: -10}}></View>
            {/* <View>
                <Text>This is Contract Reference Screen</Text>
            </View> */}<TouchableOpacity 
                style={{flex: 1, borderBottomWidth: 0.4}}>
                <View style={{flexDirection: 'row', width:'100%'}}>
                    <View style={{width: '6%',margin: AppDimensions.SMALL, marginBottom: AppDimensions.NORMAL, marginHorizontal: moderateScale(0), alignContent: 'center'}}>    
                        <IconOutline
                            name="star"
                            size={25}
                            color={AppColors.FAV_LIST_COLOR}
                        />
                    </View>
                    <View style={{margin: AppDimensions.SMALL, marginBottom: AppDimensions.NORMAL, marginHorizontal: moderateScale(10), width: '12%', alignItems: 'center'}}>
                        <Text style={{color: AppColors.FIVE_DAYS_COLOR}}>P3856</Text>
                    </View>
                    <View style={{flex: 1, width:'90%', alignSelf: 'center', marginHorizontal: moderateScale(0), marginBottom: AppDimensions.NORMAL}}>
                        <Text style={{ flexWrap: 'wrap', color: AppColors.FIVE_DAYS_COLOR}}>Engineering, Procurement And Construction Works Of Lot 1</Text>
                    </View>
                    <View style={{width: '23%', flexDirection: 'row', alignItems: 'center', marginBottom: AppDimensions.NORMAL}}>
                        <Text style={{fontSize: moderateScale(11),color: AppColors.FIVE_DAYS_COLOR}}>21-Mar-2021</Text>
                        <Text style={{fontSize: moderateScale(11),color: AppColors.FIVE_DAYS_COLOR}}>(3)</Text>
                    </View>
                    
                </View>
            </TouchableOpacity>
            <TouchableOpacity 
                style={{flex: 1, borderBottomWidth: 0.4}}>
                <View style={{flexDirection: 'row', width:'100%'}}>
                    <View style={{width: '6%',margin: AppDimensions.SMALL, marginBottom: AppDimensions.NORMAL, marginHorizontal: moderateScale(0), alignContent: 'center'}}>    
                        <IconOutline
                            name="star"
                            size={25}
                            color={AppColors.FAV_LIST_COLOR}
                        />
                    </View>
                    <View style={{margin: AppDimensions.SMALL, marginBottom: AppDimensions.NORMAL, marginHorizontal: moderateScale(10), width: '12%', alignItems: 'center'}}>
                        <Text style={{color: AppColors.FIVE_DAYS_COLOR}}>P3856</Text>
                    </View>
                    <View style={{flex: 1, width:'90%', alignSelf: 'center', marginHorizontal: moderateScale(0), marginBottom: AppDimensions.NORMAL}}>
                        <Text style={{ flexWrap: 'wrap', color: AppColors.FIVE_DAYS_COLOR}}>Providing Tukucha Khola Wastewater Treatment Plant</Text>
                    </View>
                    <View style={{width: '23%', flexDirection: 'row', alignItems: 'center', marginBottom: AppDimensions.NORMAL}}>
                        <Text style={{fontSize: moderateScale(11), color: AppColors.FIVE_DAYS_COLOR}}>21-Mar-2021</Text>
                        <Text style={{fontSize: moderateScale(11), color: AppColors.FIVE_DAYS_COLOR}}>(3)</Text>
                    </View>
                    
                </View>
            </TouchableOpacity>
            <TouchableOpacity 
                style={{flex: 1, borderBottomWidth: 0.4}}>
                <View style={{flexDirection: 'row', width:'100%'}}>
                    <View style={{width: '6%',margin: AppDimensions.SMALL, marginBottom: AppDimensions.NORMAL, marginHorizontal: moderateScale(0), alignContent: 'center'}}>    
                        <IconOutline
                            name="star"
                            size={25}
                            color={AppColors.FAV_LIST_COLOR}
                        />
                    </View>
                    <View style={{margin: AppDimensions.SMALL, marginBottom: AppDimensions.NORMAL, marginHorizontal: moderateScale(10), width: '12%', alignItems: 'center'}}>
                        <Text style={{color: AppColors.FIVE_DAYS_COLOR}}>P3856</Text>
                    </View>
                    <View style={{flex: 1, width:'90%', alignSelf: 'center', marginHorizontal: moderateScale(0), marginBottom: AppDimensions.NORMAL}}>
                        <Text style={{ flexWrap: 'wrap', color: AppColors.FIVE_DAYS_COLOR}}>Supply Of Guiding Catheter.</Text>
                    </View>
                    <View style={{width: '23%', flexDirection: 'row', alignItems: 'center', marginBottom: AppDimensions.NORMAL}}>
                        <Text style={{fontSize: moderateScale(11), color: AppColors.FIVE_DAYS_COLOR}}>21-Mar-2021</Text>
                        <Text style={{fontSize: moderateScale(11), color: AppColors.FIVE_DAYS_COLOR}}>(3)</Text>
                    </View>
                    
                </View>
            </TouchableOpacity>
            <TouchableOpacity 
                style={{flex: 1, borderBottomWidth: 0.4}}>
                <View style={{flexDirection: 'row', width:'100%'}}>
                    <View style={{width: '6%',margin: AppDimensions.SMALL, marginBottom: AppDimensions.NORMAL, marginHorizontal: moderateScale(0), alignContent: 'center'}}>    
                        <IconOutline
                            name="star"
                            size={25}
                            color={AppColors.FAV_LIST_COLOR}
                        />
                    </View>
                    <View style={{margin: AppDimensions.SMALL, alignSelf: 'center', marginBottom: AppDimensions.NORMAL, marginHorizontal: moderateScale(10), width: '12%', alignItems: 'center'}}>
                        <Text style={{color: AppColors.FIFTEEN_DAYS_COLOR}}>P3856</Text>
                    </View>
                    <View style={{flex: 1, width:'90%', alignSelf: 'center', marginHorizontal: moderateScale(0), marginBottom: AppDimensions.NORMAL}}>
                        <Text style={{ flexWrap: 'wrap', color: AppColors.FIFTEEN_DAYS_COLOR}}>Supply Of Guiding Catheter.</Text>
                    </View>
                    <View style={{width: '23%', flexDirection: 'row', alignItems: 'center', marginBottom: AppDimensions.NORMAL}}>
                        <Text style={{fontSize: moderateScale(11), color: AppColors.FIFTEEN_DAYS_COLOR}}>21-Mar-2021</Text>
                        <Text style={{fontSize: moderateScale(11), color: AppColors.FIFTEEN_DAYS_COLOR}}>(3)</Text>
                    </View>
                    
                </View>
            </TouchableOpacity>
            <TouchableOpacity 
                style={{flex: 1, borderBottomWidth: 0.4}}>
                <View style={{flexDirection: 'row', width:'100%'}}>
                    <View style={{width: '6%',margin: AppDimensions.SMALL, marginBottom: AppDimensions.NORMAL, marginHorizontal: moderateScale(0), alignContent: 'center'}}>    
                        <IconOutline
                            name="star"
                            size={25}
                            color={AppColors.FAV_LIST_COLOR}
                        />
                    </View>
                    <View style={{margin: AppDimensions.SMALL, alignSelf: 'center', marginBottom: AppDimensions.NORMAL, marginHorizontal: moderateScale(10), width: '12%', alignItems: 'center'}}>
                        <Text style={{color: AppColors.FIFTEEN_DAYS_COLOR}}>P3856</Text>
                    </View>
                    <View style={{flex: 1, width:'90%', alignSelf: 'center', marginHorizontal: moderateScale(0), marginBottom: AppDimensions.NORMAL}}>
                        <Text style={{ flexWrap: 'wrap', color: AppColors.FIFTEEN_DAYS_COLOR}}>Procurement Of Oral Contraceptive Pills.</Text>
                    </View>
                    <View style={{width: '23%', flexDirection: 'row', alignItems: 'center', marginBottom: AppDimensions.NORMAL}}>
                        <Text style={{fontSize: moderateScale(11), color: AppColors.FIFTEEN_DAYS_COLOR}}>21-Mar-2021</Text>
                        <Text style={{fontSize: moderateScale(11), color: AppColors.FIFTEEN_DAYS_COLOR}}>(3)</Text>
                    </View>
                </View>
            </TouchableOpacity>
            <TouchableOpacity 
                style={{flex: 1, borderBottomWidth: 0.4}}>
                <View style={{flexDirection: 'row', width:'100%'}}>
                    <View style={{width: '6%',margin: AppDimensions.SMALL, marginBottom: AppDimensions.NORMAL, marginHorizontal: moderateScale(0), alignContent: 'center'}}>    
                        <IconOutline
                            name="star"
                            size={25}
                            color={AppColors.FAV_LIST_COLOR}
                        />
                    </View>
                    <View style={{margin: AppDimensions.SMALL, marginBottom: AppDimensions.NORMAL, marginHorizontal: moderateScale(10), width: '12%', alignItems: 'center'}}>
                        <Text style={{color: AppColors.FIFTEEN_DAYS_COLOR}}>P3856</Text>
                    </View>
                    <View style={{flex: 1, width:'90%', alignSelf: 'center', marginHorizontal: moderateScale(0), marginBottom: AppDimensions.NORMAL}}>
                        <Text style={{ flexWrap: 'wrap',  color: AppColors.FIFTEEN_DAYS_COLOR}}>Procurement Of Shoddy Yarn.</Text>
                    </View>
                    <View style={{width: '23%', flexDirection: 'row', alignItems: 'center', marginBottom: AppDimensions.NORMAL}}>
                        <Text style={{fontSize: moderateScale(11), color: AppColors.FIFTEEN_DAYS_COLOR}}>21-Mar-2021</Text>
                        <Text style={{fontSize: moderateScale(11), color: AppColors.FIFTEEN_DAYS_COLOR}}>(3)</Text>
                    </View>
                    
                </View>
            </TouchableOpacity>
            <TouchableOpacity 
                style={{flex: 1, borderBottomWidth: 0.4}}>
                <View style={{flexDirection: 'row', width:'100%'}}>
                    <View style={{width: '6%',margin: AppDimensions.SMALL, marginBottom: AppDimensions.NORMAL, marginHorizontal: moderateScale(0), alignContent: 'center'}}>    
                        <IconOutline
                            name="star"
                            size={25}
                            color={AppColors.FAV_LIST_COLOR}
                        />
                    </View>
                    <View style={{margin: AppDimensions.SMALL, alignSelf: 'center', marginBottom: AppDimensions.NORMAL, marginHorizontal: moderateScale(10), width: '12%', alignItems: 'center'}}>
                        <Text>P3856</Text>
                    </View>
                    <View style={{flex: 1, width:'90%', marginHorizontal: moderateScale(0), alignSelf: 'center', marginBottom: AppDimensions.NORMAL}}>
                        <Text style={{ flexWrap: 'wrap', height: moderateScale(36)}}>Nepal Distribution System Upgrade And Expansion Project.</Text>
                    </View>
                    <View style={{width: '23%', flexDirection: 'row', alignItems: 'center', marginBottom: AppDimensions.NORMAL}}>
                        <Text style={{fontSize: moderateScale(11)}}>21-Mar-2021</Text>
                        <Text style={{fontSize: moderateScale(11)}}>(3)</Text>
                    </View>
                    
                </View>
            </TouchableOpacity>
            <TouchableOpacity 
                style={{flex: 1, borderBottomWidth: 0.4}}>
                <View style={{flexDirection: 'row', width:'100%'}}>
                    <View style={{width: '6%',margin: AppDimensions.SMALL, marginBottom: AppDimensions.NORMAL, marginHorizontal: moderateScale(0), alignContent: 'center'}}>    
                        <IconOutline
                            name="star"
                            size={25}
                            color={AppColors.FAV_LIST_COLOR}
                        />
                    </View>
                    <View style={{margin: AppDimensions.SMALL, marginBottom: AppDimensions.NORMAL, marginHorizontal: moderateScale(10), width: '12%', alignItems: 'center'}}>
                        <Text>P3856</Text>
                    </View>
                    <View style={{flex: 1, width:'90%', marginHorizontal: moderateScale(0), marginBottom: AppDimensions.NORMAL}}>
                        <Text style={{ flexWrap: 'wrap'}}>Engineering, Procurement And Construction Works Of Lot 1</Text>
                    </View>
                    <View style={{width: '23%', flexDirection: 'row', alignItems: 'center', marginBottom: AppDimensions.NORMAL}}>
                        <Text style={{fontSize: moderateScale(11)}}>21-Mar-2021</Text>
                        <Text style={{fontSize: moderateScale(11)}}>(3)</Text>
                    </View>
                    
                </View>
            </TouchableOpacity>
            <TouchableOpacity 
                style={{flex: 1, borderBottomWidth: 0.4}}>
                <View style={{flexDirection: 'row', width:'100%'}}>
                    <View style={{width: '6%',margin: AppDimensions.SMALL, marginBottom: AppDimensions.NORMAL, marginHorizontal: moderateScale(0), alignContent: 'center'}}>    
                        <IconOutline
                            name="star"
                            size={25}
                            color={AppColors.FAV_LIST_COLOR}
                        />
                    </View>
                    <View style={{margin: AppDimensions.SMALL, marginBottom: AppDimensions.NORMAL, marginHorizontal: moderateScale(10), width: '12%', alignItems: 'center'}}>
                        <Text>P3856</Text>
                    </View>
                    <View style={{flex: 1, width:'90%', marginHorizontal: moderateScale(0), marginBottom: AppDimensions.NORMAL}}>
                        <Text style={{ flexWrap: 'wrap'}}>Engineering, Procurement And Construction Works Of Lot 1</Text>
                    </View>
                    <View style={{width: '23%', flexDirection: 'row', alignItems: 'center', marginBottom: AppDimensions.NORMAL}}>
                        <Text style={{fontSize: moderateScale(11)}}>21-Mar-2021</Text>
                        <Text style={{fontSize: moderateScale(11)}}>(3)</Text>
                    </View>
                    
                </View>
            </TouchableOpacity>
            <TouchableOpacity 
                style={{flex: 1, borderBottomWidth: 0.4}}>
                <View style={{flexDirection: 'row', width:'100%'}}>
                    <View style={{width: '6%',margin: AppDimensions.SMALL, marginBottom: AppDimensions.NORMAL, marginHorizontal: moderateScale(0), alignContent: 'center'}}>    
                        <IconOutline
                            name="star"
                            size={25}
                            color={AppColors.FAV_LIST_COLOR}
                        />
                    </View>
                    <View style={{margin: AppDimensions.SMALL, marginBottom: AppDimensions.NORMAL, marginHorizontal: moderateScale(10), width: '12%', alignItems: 'center'}}>
                        <Text>P3856</Text>
                    </View>
                    <View style={{flex: 1, width:'90%', marginHorizontal: moderateScale(0), marginBottom: AppDimensions.NORMAL}}>
                        <Text style={{ flexWrap: 'wrap'}}>Engineering, Procurement And Construction Works Of Lot 1</Text>
                    </View>
                    <View style={{width: '23%', flexDirection: 'row', alignItems: 'center', marginBottom: AppDimensions.NORMAL}}>
                        <Text style={{fontSize: moderateScale(11)}}>21-Mar-2021</Text>
                        <Text style={{fontSize: moderateScale(11)}}>(3)</Text>
                    </View>
                    
                </View>
            </TouchableOpacity>
            <TouchableOpacity 
                style={{flex: 1, borderBottomWidth: 0.4}}>
                <View style={{flexDirection: 'row', width:'100%'}}>
                    <View style={{width: '6%',margin: AppDimensions.SMALL, marginBottom: AppDimensions.NORMAL, marginHorizontal: moderateScale(0), alignContent: 'center'}}>    
                        <IconOutline
                            name="star"
                            size={25}
                            color={AppColors.FAV_LIST_COLOR}
                        />
                    </View>
                    <View style={{margin: AppDimensions.SMALL, marginBottom: AppDimensions.NORMAL, marginHorizontal: moderateScale(10), width: '12%', alignItems: 'center'}}>
                        <Text>P3856</Text>
                    </View>
                    <View style={{flex: 1, width:'90%', marginHorizontal: moderateScale(0), marginBottom: AppDimensions.NORMAL}}>
                        <Text style={{ flexWrap: 'wrap'}}>Engineering, Procurement And Construction Works Of Lot 1</Text>
                    </View>
                    <View style={{width: '23%', flexDirection: 'row', alignItems: 'center', marginBottom: AppDimensions.NORMAL}}>
                        <Text style={{fontSize: moderateScale(11)}}>21-Mar-2021</Text>
                        <Text style={{fontSize: moderateScale(11)}}>(3)</Text>
                    </View>
                    
                </View>
            </TouchableOpacity>
        </View>
               
    )
}

export default ContractScreen;

const styles = StyleSheet.create({

});