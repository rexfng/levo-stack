import axios from 'axios';

	export function flattenObjectByOneLevel(obj){
		for (var k in obj){
			return obj[k]
		}	
	}

	export function isEmpty(obj) {
	    for(var key in obj) {
	        if(obj.hasOwnProperty(key))
	            return false;
	    }
	    return true;
	}
    export function mergeChildren(state, payload){
      let obj = {}
      for (var ks in state){
        for (var kp in payload)
          if (ks == kp){
            let merge = Object.assign(state[ks], payload[kp])
            obj[ks] = merge
            console.log(merge)
          }else{
            obj[ks] = state[ks]
          }
      }
      return obj
    }

	function getObjectKey(obj){
		for (var k in obj){
			return k
		}			
	}
	function flatten(data) {
	    var result = {};
	    function recurse (cur, prop) {
	        if (Object(cur) !== cur) {
	            result[prop] = cur;
	        } else if (Array.isArray(cur)) {
	             for(var i=0, l=cur.length; i<l; i++)
	                 recurse(cur[i], prop + "[" + i + "]");
	            if (l == 0)
	                result[prop] = [];
	        } else {
	            var isEmpty = true;
	            for (var p in cur) {
	                isEmpty = false;
	                recurse(cur[p], prop ? prop+"."+p : p);
	            }
	            if (isEmpty && prop)
	                result[prop] = {};
	        }
	    }
	    recurse(data, "");
	    return result;
	}

	function unflatten(data) {
	    "use strict";
	    if (Object(data) !== data || Array.isArray(data))
	        return data;
	    var regex = /\.?([^.\[\]]+)|\[(\d+)\]/g,
	        resultholder = {};
	    for (var p in data) {
	        var cur = resultholder,
	            prop = "",
	            m;
	        while (m = regex.exec(p)) {
	            cur = cur[prop] || (cur[prop] = (m[2] ? [] : {}));
	            prop = m[2] || m[1];
	        }
	        cur[prop] = data[p];
	    }
	    return resultholder[""] || resultholder;
	};

	function isObject ( obj ) {
	   return obj && (typeof obj  === "object");
	}

	export function isArray ( obj ) { 
	  return isObject(obj) && (obj instanceof Array);
	}

	function getUniqueValuesFromCollection( arr ) {
		var array = []
		for (var i = arr.length - 1; i >= 0; i--) {
			if(!_.includes(array,arr[i])){
				array.push(arr[i])
			}
		}
		return array
	}
	function pickArray (obj){
		var saveArray = []
		for( var k in obj ){
			if( isArray(obj[k]) ){
				saveArray.push({[k]: obj[k]})
			}
		}
		return saveArray
	}

	function pickArrayKeys (obj){
		var arrayKeys = []
		for( var k in obj ){
			if( isArray(obj[k]) ){
				arrayKeys.push(k)
			}
		}
		return arrayKeys
	}

	function mergeArray(arr1, arr2){
		var concat = []
		return concat.concat(arr1, arr2).filter(Boolean);
	}

	function objectToArray(obj){
		var arr = []
			for (var k in obj){
				arr.push(obj[k])
			}
		return arr;
	}

	function arrayToObject(arr){
		var obj = {}
		for (var i = 0; i < arr.length; i++) {
			obj = Object.assign(obj, arr[i])
		}
		return obj
	}

	function arrayMerge(arr) {
		var output = [];

		arr.forEach(function(value) {
		  var existing = output.filter(function(v, i) {
		    return v.name == value.name;
		  });
		  if (existing.length) {
		    var existingIndex = output.indexOf(existing[0]);
		    output[existingIndex].value = output[existingIndex].value.concat(value.value);
		  } else {
		    if (typeof value.value == 'string')
		      value.value = [value.value];
		    output.push(value);
		  }
		});

		return output;
	}

	function mergeObjectsByKeys(arr1, arr2) {
		var uniqueKeys = pickArrayKeys(Object.assign({}, arr1, arr2));
		returnObj = {};
		for (var i = 0; i < uniqueKeys.length; i++) {
			 returnObj[uniqueKeys[i]] = mergeArray(arr1[uniqueKeys[i]], arr2[uniqueKeys[i]]) 
		}
		return returnObj;
	}

	function mergeObjects(arr1, arr2){
		var arr3 = mergeObjectsByKeys(arr1, arr2)
		var obj = Object.assign({}, arr1, arr2, arr3)
		return obj
	}

	function isMatchingParentKey(obj1,obj2){
		for ( var k1 in obj1){
			for( var k2 in obj2){
				if (k1 == k2){
					return true
				}else{
					return false
				}
			}
		}		
	}


	export function axiosPostByType(obj, callback, httpResponse=false){
		var obj = flattenObjectByOneLevel(_.omit(obj, [0]));
 		for( var k in obj){
			var i = 0; i < 1;
				axios.post('https://reach-api-server.herokuapp.com/api/v1/' + k, obj[k])
			  .then(function (response) {
			  	if (httpResponse == true) {
			  		if (response.data !== '') {
			 		  	callback(response.data);
			  		}
			  	} else {
			  		if (i < 1) {
						callback(_.omit(obj, [0]))	
			  		}
						i++;
			  	}
			  })
			  .catch(function (error) {
			    console.log(error);
			  });
 		}	
	}

	export function axiosGetByType(type, callback, id='' ){
		axios.get('https://reach-api-server.herokuapp.com/api/v1/' + type + '/' + id)
		  .then(function (response) {
		    callback(response);
		  })
		  .catch(function (error) {
		    console.log(error);
		  });
	}	

	export function deepMergeObjects(obj1, obj2){
		//for each parent key return 
		if (isMatchingParentKey(obj1,obj2)) {
			return { [getObjectKey(obj2)]: mergeObjects(flattenObjectByOneLevel(obj1),flattenObjectByOneLevel(obj2))}
		}else{
			if (!isArray(obj1)) {
				return [
					obj1,
					obj2
				]
			}else{
				newObj = Object.assign(arrayToObject(obj1),
					obj2)
				return [
					newObj
				]
			}
		}
	}
