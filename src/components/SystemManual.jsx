import React from 'react';
import './SystemManual.css';

const SystemManual = ({ onBack }) => {
    return (
        <div className="system-manual-page">
            <div className="manual-header">
                <button className="back-button" onClick={onBack}>← BACK</button>
                <h2 className="manual-page-title">天狗精灵TenguVox 系统说明</h2>
            </div>

            <div className="manual-content-wrapper">
                <div className="manual-content">
                    {/* 系统介绍 */}
                    <div className="manual-section">
                        <p className="manual-intro">
                            欢迎使用 天狗精灵TenguVox。
                        </p>
                        <p className="manual-text">
                            天狗精灵TenguVox 是一套声纹采集与语音还原系统，通过分布在各个区域的麦克风采集声音，提取声纹特征数据，并加密存储。系统不会保存任何原始音频录音，所有可听内容均是基于声纹数据进行还原合成的结果。你听到的声音并非原始录音，而是系统对声纹特征进行解析后重建的语音。
                        </p>
                    </div>

                    {/* 系统组成 */}
                    <div className="manual-section">
                        <h4 className="section-title">系统组成 SYSTEM COMPONENTS</h4>
                        <p className="manual-text">
                            本系统由区域选择面板、时间轴、信息提示区、声纹库、解析按钮和状态指示器等模块组成。
                        </p>
                    </div>

                    {/* 操作流程 */}
                    <div className="manual-section">
                        <h4 className="section-title">操作流程 OPERATION PROCEDURE</h4>

                        <div className="procedure-step">
                            <span className="step-num">1</span>
                            <div className="step-content">
                                <p className="step-desc">选定时间点：时间轴选定具体的时间点 - 系统已经告诉你时间轴上每个时间点已解锁/未解锁的对话数量</p>
                            </div>
                        </div>

                        <div className="procedure-step">
                            <span className="step-num">2</span>
                            <div className="step-content">
                                <p className="step-desc">选择调查位置：点击场景平面图上的任意区域来选择想要调查的位置</p>
                            </div>
                        </div>

                        <div className="procedure-step">
                            <span className="step-num">3</span>
                            <div className="step-content">
                                <p className="step-desc">匹配声纹：从声纹库中选择角色，将它们匹配到对应的时间、场景上。声纹库中需要选择你可能需要匹配的人物，但系统并不确定谁真的在场，需要由你来验证并完成配对</p>
                            </div>
                        </div>

                        <div className="procedure-step">
                            <span className="step-num">4</span>
                            <div className="step-content">
                                <p className="step-desc">解析验证：匹配完成后，点击解析按钮，系统会校验你的匹配是否正确</p>
                            </div>
                        </div>
                    </div>

                    {/* 解析结果 */}
                    <div className="manual-section">
                        <h4 className="section-title">解析结果 PARSING RESULTS</h4>

                        <div className="result-item">
                            <span className="result-indicator success"></span>
                            <div className="result-desc">
                                <strong>完全匹配：</strong>如果匹配完全正确，系统就会播放还原出的对话内容
                            </div>
                        </div>

                        <div className="result-item">
                            <span className="result-indicator partial"></span>
                            <div className="result-desc">
                                <strong>部分匹配：</strong>如果只有部分匹配正确，系统只能播放匹配正确的那些角色的台词，其余部分会标记为无法解析
                            </div>
                        </div>

                        <div className="result-item">
                            <span className="result-indicator failed"></span>
                            <div className="result-desc">
                                <strong>匹配失败：</strong>如果存在错误的匹配，系统不会播放任何内容，并提示匹配度不足
                            </div>
                        </div>

                    </div>

                    {/* 状态指示器 */}
                    <div className="manual-section">
                        <h4 className="section-title">状态指示器 STATUS INDICATORS</h4>
                        <div className="status-grid">
                            <div className="status-item">
                                <span className="status-dot ready"></span>
                                <span className="status-text">待机状态 - 设备正常运行</span>
                            </div>
                            <div className="status-item">
                                <span className="status-dot analyzing"></span>
                                <span className="status-text">解析中 - 正在处理数据</span>
                            </div>
                            <div className="status-item">
                                <span className="status-dot matched"></span>
                                <span className="status-text">匹配成功 - 验证通过</span>
                            </div>
                            <div className="status-item">
                                <span className="status-dot error"></span>
                                <span className="status-text">匹配失败 - 验证未通过</span>
                            </div>
                        </div>
                    </div>

                    {/* 常见问题 */}
                    <div className="manual-section">
                        <h4 className="section-title">常见问题 FREQUENTLY ASKED QUESTIONS</h4>

                        <div className="faq-item">
                            <div className="faq-question">问：为什么不能直接听录音？</div>
                            <div className="faq-answer">答：天狗精灵TenguVox 出于隐私保护的设计，不存储任何原始音频，只保存加密后的声纹特征码。</div>
                        </div>

                        <div className="faq-item">
                            <div className="faq-question">问：如果匹配错了会怎样？</div>
                            <div className="faq-answer">答：系统会提示匹配度不足，不会播放内容。</div>
                        </div>

                        <div className="faq-item">
                            <div className="faq-question">问：角色声纹需要自己采集吗？</div>
                            <div className="faq-answer">答：所有角色的声纹样本都已预先录入系统，你只需要从声纹库中选择即可。</div>
                        </div>

                        <div className="faq-item">
                            <div className="faq-question">问：我听到的声音是真实的吗？</div>
                            <div className="faq-answer">答：你听到的是系统根据声纹特征数据还原合成的语音，内容与当时实际对话一致，但音色并非原始录音。</div>
                        </div>
                    </div>

                    {/* 版本信息 */}
                    <div className="manual-footer">
                        <p>—— 天狗精灵TenguVox 系统说明 · 版本 1.0 · created by Amber ——</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemManual;
