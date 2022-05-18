import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Animated,
  FlatList,
  Easing,
  TouchableOpacity,
  I18nManager,
  TextInput
} from 'react-native';

import {useCalendar} from '../DatePicker';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const TimeScroller = ({title, data, onChange, selected}) => {
  const {options, utils} = useCalendar();
  const [itemSize, setItemSize] = useState(0);
  const style = styles(options);
  const scrollAnimatedValue = useRef(new Animated.Value(0)).current;
  const scrollListener = useRef(null);
  const active = useRef(0);
  data = ['', '', ...data, '', ''];
  const flatListRef = useRef();

  

  useEffect(() => {
    scrollListener.current && clearInterval(scrollListener.current);
    scrollListener.current = scrollAnimatedValue.addListener(({value}) => {active.current = value;
  });
  
  
    return () => {
      clearInterval(scrollListener.current);
    };
  }, [scrollAnimatedValue]);

//   useEffect(() => {
// if(itemSize > 0 && selected)
//   {flatListRef.current.scrollToOffset({ animated: false, offset: parseInt(selected) * 100 });
// console.log(parseInt(selected) * 100);
// }

//     return () => {
//     };
//   }, [itemSize]);

  const changeItemWidth = ({nativeEvent}) => {
    const {width} = nativeEvent.layout;
    !itemSize && setItemSize(width / 5);
  };

  const renderItem = ({item, index}) => {
    const makeAnimated = (a, b, c) => {
      return {
        inputRange: [...data.map((_, i) => i * itemSize)],
        outputRange: [
          ...data.map((_, i) => {
            const center = i + 2;
            if (center === index) {
              return a;
            } else if (center + 1 === index || center - 1 === index) {
              return b;
            } else {
              return c;
            }
          }),
        ],
      };
    };

    return (
      <Animated.View
        style={[
          {
            width: itemSize,
            opacity: scrollAnimatedValue.interpolate(makeAnimated(1, 0.6, 0.3)),
            transform: [
              {
                scale: scrollAnimatedValue.interpolate(makeAnimated(1.2, 0.9, 0.8)),
              },
              {
                scaleX: I18nManager.isRTL ? -1 : 1,
              },
            ],
          },
          style.listItem,
        ]}>
        <Text style={style.listItemText}>
          {utils.toPersianNumber(String(item).length === 1 ? '0' + item : item)}
        </Text>
      </Animated.View>
    );
  };

  return (  
    <View style={style.row} onLayout={changeItemWidth}>
      <Text style={style.title}>{title}</Text>
      <AnimatedFlatList
      ref={flatListRef}
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        horizontal
        snapToInterval={itemSize}
        decelerationRate={'fast'}
        onScroll={Animated.event([{nativeEvent: {contentOffset: {x: scrollAnimatedValue}}}], {
          useNativeDriver: true,
        })}
        data={I18nManager.isRTL ? data.reverse() : data}
        onScrollEndDrag={()=>{
          const index = Math.round(active.current / itemSize);
          onChange(data[index + 2]);
          console.log('scrollAnimatedValue2');
          console.log(scrollAnimatedValue);
        }}
        
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        inverted={I18nManager.isRTL}
        contentContainerStyle={
          I18nManager.isRTL && {
            transform: [
              {
                scaleX: -1,
              },
            ],
          }
        }
      />
    </View>
  );
};

const TimeBox = ({title, onChange,selected,hour, onSubmit, forwardedRef}) => {
  const {options} = useCalendar();
  const style = styles(options);
  const [t, setT] = useState();

  useEffect(() => {
    setT(selected);
  }, [selected]);

  return (  
    <View style={{  alignItems:'center'}} >
      <Text style={style.title}>{title}</Text>
    <View   style={[style.row, { width:50, shadowOffset:{height:15, width:15}, shadowColor:'black', shadowOpacity:1, elevation:20}]}>
       <TextInput style={{fontSize:30, fontWeight:'bold'}} keyboardType='numeric' maxLength={2} 
          onSubmitEditing={() => onSubmit(hour)}
          ref={forwardedRef}
          returnKeyType={hour? 'next' : 'done'}
          onChangeText={(text)=>{
            if(hour)
            {
              if(text && parseInt(text) > 23)
              {
                setT("00");
              return;
              }
            }
            else{
              if(text && parseInt(text) > 59)
              { 
                setT("00");
                return;
              }
            }
            setT(text);
            onChange(text);
          }}
      >{t}</TextInput> 
    </View>
    </View>
  );
};


const SelectTime = () => {
  const {options, state, utils, minuteInterval, mode, onTimeChange} = useCalendar();
  const [mainState, setMainState] = state;
  const [show, setShow] = useState(false);
  const [time, setTime] = useState({
    minute: 0,
    hour: 0,
  });
  const style = styles(options);
  const openAnimation = useRef(new Animated.Value(0)).current;
  const minuteRef = useRef();

  useEffect(() => {
    show &&
      setTime({
        minute: mainState.selectedDate  ? mainState.selectedDate.split(' ')[1].split(':')[1] : 0,
        hour: mainState.selectedDate  ? mainState.selectedDate.split(' ')[1].split(':')[0] : 0,
      });
  }, [show]);
  

  useEffect(() => {
    mainState.timeOpen && setShow(true);
    Animated.timing(openAnimation, {
      toValue: mainState.timeOpen ? 1 : 0,
      duration: 350,
      useNativeDriver: true,
      easing: Easing.bezier(0.17, 0.67, 0.46, 1),
    }).start(() => {
      !mainState.timeOpen && setShow(false);
    });
  }, [mainState.timeOpen, openAnimation]);

  const selectTime = () => {
    const newTime = utils.getDate(mainState.activeDate);
    newTime.hour(time.hour).minute(time.minute);
    setMainState({
      type: 'set',
      activeDate: utils.getFormated(newTime),
      selectedDate: mainState.selectedDate
        ? utils.getFormated(
            utils
              .getDate(mainState.selectedDate)
              .hour(time.hour)
              .minute(time.minute),
          )
        : '',
    });
    onTimeChange(utils.getFormated(newTime, 'timeFormat'));
    mode !== 'time' &&
      setMainState({
        type: 'toggleTime',
      });
  };

  const onSubmit = (hour)=>{
    if(!hour)
      selectTime();
    else
      minuteRef.current.focus();
  }

  const containerStyle = [
    style.container,
    {
      opacity: openAnimation,
      transform: [
        {
          scale: openAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [1.1, 1],
          }),
        },
      ],
    },
  ];
  return show ? (
    <Animated.View style={[containerStyle,{ overflow: 'hidden', paddingBottom: 15,}]}>
      <View style={{
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity:  0.4,
        shadowRadius: 3,
        elevation: 15,
        borderRadius:30
    }}>
      <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
      <TimeBox
        title={utils.config.hour}
        onChange={hour => setTime({...time, hour})}
        selected={time.hour}
        hour
        onSubmit={onSubmit}
      />
      <Text style={{fontSize:50}} >:</Text>
      <TimeBox
        title={utils.config.minute}
        onChange={minute => setTime({...time, minute})}
        selected={time.minute}
        onSubmit={onSubmit}
        forwardedRef={minuteRef}
      />
      </View>
      <View style={style.footer}>
        <TouchableOpacity style={style.button} activeOpacity={0.8} onPress={selectTime}>
          <Text style={style.btnText}>{utils.config.timeSelect}</Text>
        </TouchableOpacity>
        {mode !== 'time' && (
          <TouchableOpacity
            style={[style.button, style.cancelButton]}
            onPress={() =>
              setMainState({
                type: 'toggleTime',
              })
            }
            activeOpacity={0.8}>
            <Text style={style.btnText}>{utils.config.timeClose}</Text>
          </TouchableOpacity>
        )}
      </View>
      </View>
    </Animated.View>
  ) : null;
};

const styles = theme =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      right: 0,
      backgroundColor: theme.backgroundColor,
      borderRadius: 10,
      flexDirection: 'column',
      justifyContent: 'center',
      zIndex: 999,

    },
    row: {
      flexDirection: 'column',
      alignItems: 'center',
      marginVertical: 5,
      borderWidth:1,
      borderRadius:10,
      borderColor:'gray'
    },
    title: {
      fontSize: theme.textHeaderFontSize,
      color: theme.mainColor,
      fontFamily: theme.headerFont,
    },
    listItem: {
      height: 60,
      alignItems: 'center',
      justifyContent: 'center',
    },
    listItemText: {
      fontSize: theme.textHeaderFontSize,
      color: theme.textDefaultColor,
      fontFamily: theme.defaultFont,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 15,
    },
    button: {
      paddingVertical: 10,
      paddingHorizontal: 25,
      borderRadius: 8,
      backgroundColor: theme.mainColor,
      margin: 8,
    },
    btnText: {
      fontSize: theme.textFontSize,
      color: theme.selectedTextColor,
      fontFamily: theme.defaultFont,
    },
    cancelButton: {
      backgroundColor: theme.textSecondaryColor,
    },
  });

export {SelectTime};
