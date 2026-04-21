/**
 * Hermes代码位置验证脚本
 * 验证Hermes源代码位置配置是否正确
 */

const fs = require('fs');
const path = require('path');

// 验证Hermes代码位置
function verifyHermesCodeLocations() {
  console.log('=== 验证Hermes代码位置 ===\n');
  
  try {
    // 读取配置文件
    const configPath = 'hermes_code_locations.json';
    if (!fs.existsSync(configPath)) {
      console.error('配置文件不存在:', configPath);
      return false;
    }
    
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    console.log('读取配置文件成功');
    
    // 验证每个位置
    let allValid = true;
    
    config.hermes_code_locations.forEach(location => {
      console.log(`\n验证位置: ${location.name}`);
      console.log(`路径: ${location.path}`);
      
      // 检查路径是否存在
      if (fs.existsSync(location.path)) {
        console.log('✅ 路径存在');
        
        // 检查子目录
        if (location.subdirectories) {
          console.log('子目录:');
          location.subdirectories.forEach(subdir => {
            const subdirPath = path.join(location.path, subdir);
            if (fs.existsSync(subdirPath) && fs.statSync(subdirPath).isDirectory()) {
              console.log(`  ✅ ${subdir}`);
            } else {
              console.log(`  ❌ ${subdir}`);
              allValid = false;
            }
          });
        }
        
        // 检查文件
        if (location.files) {
          console.log('文件:');
          location.files.forEach(file => {
            const filePath = path.join(location.path, file);
            if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
              console.log(`  ✅ ${file}`);
            } else {
              console.log(`  ❌ ${file}`);
              allValid = false;
            }
          });
        }
        
        // 检查是否是Git仓库
        if (location.is_git_repo) {
          const gitPath = path.join(location.path, '.git');
          if (fs.existsSync(gitPath) && fs.statSync(gitPath).isDirectory()) {
            console.log('✅ 是Git仓库');
          } else {
            console.log('❌ 不是Git仓库');
            allValid = false;
          }
        }
        
      } else {
        console.log('❌ 路径不存在');
        allValid = false;
      }
    });
    
    console.log('\n=== 验证结果 ===');
    if (allValid) {
      console.log('✅ 所有Hermes代码位置验证通过');
    } else {
      console.log('❌ 部分Hermes代码位置验证失败');
    }
    
    return allValid;
  } catch (error) {
    console.error('验证过程中出现错误:', error.message);
    return false;
  }
}

// 验证GitHub同步配置
function verifyGitHubSyncConfig() {
  console.log('\n=== 验证GitHub同步配置 ===\n');
  
  try {
    const configPath = 'github_sync_config.json';
    if (!fs.existsSync(configPath)) {
      console.error('GitHub同步配置文件不存在:', configPath);
      return false;
    }
    
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    console.log('读取GitHub同步配置文件成功');
    
    let allValid = true;
    
    config.repositories.forEach(repo => {
      console.log(`\n验证仓库: ${repo.name}`);
      console.log(`本地路径: ${repo.local_path}`);
      
      // 检查本地路径是否存在
      if (fs.existsSync(repo.local_path)) {
        console.log('✅ 本地路径存在');
      } else {
        console.log('❌ 本地路径不存在');
        allValid = false;
      }
      
      // 检查是否是Git仓库
      const gitPath = path.join(repo.local_path, '.git');
      if (fs.existsSync(gitPath) && fs.statSync(gitPath).isDirectory()) {
        console.log('✅ 是Git仓库');
      } else {
        console.log('⚠️  不是Git仓库');
      }
    });
    
    console.log('\n=== 验证结果 ===');
    if (allValid) {
      console.log('✅ GitHub同步配置验证通过');
    } else {
      console.log('❌ GitHub同步配置验证失败');
    }
    
    return allValid;
  } catch (error) {
    console.error('验证过程中出现错误:', error.message);
    return false;
  }
}

// 执行验证
if (require.main === module) {
  const hermesValid = verifyHermesCodeLocations();
  const syncValid = verifyGitHubSyncConfig();
  
  console.log('\n=== 总体验证结果 ===');
  if (hermesValid && syncValid) {
    console.log('✅ 所有验证通过');
    process.exit(0);
  } else {
    console.log('❌ 验证失败');
    process.exit(1);
  }
}

module.exports = {
  verifyHermesCodeLocations,
  verifyGitHubSyncConfig
};