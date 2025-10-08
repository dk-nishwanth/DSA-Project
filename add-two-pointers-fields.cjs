const fs = require('fs');

let content = fs.readFileSync('src/data/dsaTopics.ts', 'utf8');

const additions = {
  'two-pointers-intro': {
    example: `twoSum([2,7,11,15], 9) = [0,1]
isPalindrome("racecar") = true
removeDuplicates([1,1,2,2,3]) = [1,2,3]`,
    syntax: `// Opposite direction
function isPalindrome(s) {
  let left = 0, right = s.length - 1;
  while (left < right) {
    if (s[left] !== s[right]) return false;
    left++; right--;
  }
  return true;
}

// Same direction
function removeDuplicates(nums) {
  let i = 0;
  for (let j = 1; j < nums.length; j++) {
    if (nums[j] !== nums[i]) {
      nums[++i] = nums[j];
    }
  }
  return i + 1;
}`
  },
  'two-sum': {
    example: `twoSum([2,7,11,15], target=9) = [0,1]
// nums[0] + nums[1] = 2 + 7 = 9
twoSum([3,2,4], target=6) = [1,2]`,
    syntax: `// Hash map approach - O(n)
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}

// Two pointers (sorted) - O(n)
function twoSumSorted(nums, target) {
  let left = 0, right = nums.length - 1;
  while (left < right) {
    const sum = nums[left] + nums[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;
    else right--;
  }
  return [];
}`
  }
};

// Continue in next part...
console.log('Adding Two Pointers fields...');


additions['three-sum'] = {
  example: `threeSum([-1,0,1,2,-1,-4]) = [[-1,-1,2],[-1,0,1]]
// All unique triplets that sum to 0
threeSum([0,0,0]) = [[0,0,0]]`,
  syntax: `function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const result = [];
  
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i-1]) continue;
    
    let left = i + 1, right = nums.length - 1;
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      if (sum === 0) {
        result.push([nums[i], nums[left], nums[right]]);
        while (left < right && nums[left] === nums[left+1]) left++;
        while (left < right && nums[right] === nums[right-1]) right--;
        left++; right--;
      } else if (sum < 0) left++;
      else right--;
    }
  }
  return result;
}`
};

additions['container-water'] = {
  example: `maxArea([1,8,6,2,5,4,8,3,7]) = 49
// Container between index 1 and 8: min(8,7) * 7 = 49
maxArea([1,1]) = 1`,
  syntax: `function maxArea(height) {
  let left = 0, right = height.length - 1;
  let maxArea = 0;
  
  while (left < right) {
    const width = right - left;
    const h = Math.min(height[left], height[right]);
    maxArea = Math.max(maxArea, width * h);
    
    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }
  return maxArea;
}`
};

additions['remove-duplicates'] = {
  example: `removeDuplicates([1,1,2,2,3]) = 3
// Modified array: [1,2,3,_,_]
removeDuplicates([0,0,1,1,1,2,2,3,3,4]) = 5`,
  syntax: `function removeDuplicates(nums) {
  if (nums.length === 0) return 0;
  
  let i = 0;
  for (let j = 1; j < nums.length; j++) {
    if (nums[j] !== nums[i]) {
      i++;
      nums[i] = nums[j];
    }
  }
  return i + 1;
}`
};

additions['merge-sorted-arrays'] = {
  example: `merge([1,2,3,0,0,0], m=3, [2,5,6], n=3)
// Result: [1,2,2,3,5,6]
merge([1], m=1, [], n=0) = [1]`,
  syntax: `function merge(nums1, m, nums2, n) {
  let i = m - 1, j = n - 1, k = m + n - 1;
  
  while (i >= 0 && j >= 0) {
    if (nums1[i] > nums2[j]) {
      nums1[k--] = nums1[i--];
    } else {
      nums1[k--] = nums2[j--];
    }
  }
  
  while (j >= 0) {
    nums1[k--] = nums2[j--];
  }
}`
};

// Now add fields to each topic
for (const [topicId, fields] of Object.entries(additions)) {
  const { example, syntax } = fields;
  
  // Find where implementationCode ends (look for console.log or closing backtick before next section)
  const topicPattern = new RegExp(
    `(id:\\s*['"]${topicId}['"][\\s\\S]*?console\\.log[\\s\\S]*?\`,)\\s*(quizQuestions:|},)`,
    'g'
  );
  
  if (topicPattern.test(content)) {
    content = content.replace(topicPattern, 
      `$1\n        example: \`${example}\`,\n        syntax: \`${syntax}\`,\n        $2`
    );
    console.log(`✅ Added fields to ${topicId}`);
  } else {
    console.log(`❌ Pattern not found for ${topicId}`);
  }
}

fs.writeFileSync('src/data/dsaTopics.ts', content, 'utf8');
console.log('\n✅ Done!');
